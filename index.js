/**
 * Module Dependencies
 */

var debug = require('debug')('x-ray:nightmare');
var normalize = require('normalizeurl');
var Nightmare = require('nightmare');
var wrapfn = require('wrap-fn');

/**
 * Export `driver`
 */

module.exports = driver;

/**
 * Initialize the `driver`
 * with the following `options`
 *
 * @param {Object} options
 * @param {Function} fn
 * @return {Function}
 * @api public
 */

function driver(options, fn) {
    if ('function' == typeof options) fn = options, options = {};
    options = options || {};
    fn = fn || electron;
    var nightmare = new Nightmare(options);


    return function nightmare_driver(ctx, done) {
        debug('going to %s', ctx.url);

        nightmare
            .on('page',function(type,message,stack) {
                if (type == 'error')
                    debug('page error: %s',message);
            })
            .on('did-fail-load', function(event, errorCode, errorDescription) {
                debug('failed to load with error %s: %s', errorCode, errorDescription);
                return done (new Error(errorDescription))
            })
            .on('did-get-redirect-request', function(event, oldUrl, newUrl, isMainFrame) {
                if (normalize(oldUrl) == normalize(ctx.url)) {
                    debug('redirect: %s', newUrl);
                    ctx.url = newUrl;
                }
            })
            .on('will-navigate', function(url) {
                if (normalize(url) == normalize(ctx.url)) {
                    debug('redirect: %s', url);
                    ctx.url = url;
                }
            })
            .on('did-get-response-details', function(event, status, newUrl, originalUrl, httpResponseCode, requestMethod, referrer, headers) {
                if (normalize(originalUrl) == normalize(ctx.url)) {
                    debug('redirect: %s', newUrl);
                    ctx.url = newUrl;
                };
                if (normalize(newUrl) == normalize(ctx.url) && httpResponseCode == 200) {
                    debug('got response from %s: %s', ctx.url, httpResponseCode);
                    ctx.status = httpResponseCode;
                };
            })
            .on('did-finish-load', function() {
                debug('finished loading %s', ctx.url);
            })


        wrapfn(fn, select)(ctx, nightmare);

        function select(err, ret) {
            if (err) return done(err);

            nightmare
                .evaluate(function() {
                    return document.documentElement.outerHTML;
                })

            nightmare
                .end()
                .then(function(body) {
                    ctx.body = body;
                    debug('%s - %s', ctx.url, ctx.status);
                    done(null, ctx);
                })
        };
    }
}

/**
 * Default electron driver
 *
 * @param {HTTP Context} ctx
 * @param {Nightmare} nightmare
 */

function electron(ctx, nightmare) {
    return nightmare.goto(ctx.url);
}


