/**
 * Module Dependencies
 */

var chai = require ('chai');
var Xray = require('x-ray');
var NightmareElectron = require('./');


/**
 * Tests
 */

var assert = chai.assert;
describe('X-ray-nightmare tests', function () {
    it ('should get Google title', function (done) {
        var nightmareDriver = NightmareElectron();
        var x = Xray().driver(nightmareDriver);
        x('http://www.google.com', 'title')(function(err,title) {
            console.log('Title scraped is: ' + title);
            // assert will throw an error if it fails because this is an async
            try{
                assert.equal(title, 'Google' );
                done();
            }
            // if assertion fails, error thrown so catch it so it isn't a timeout problem
            catch (err) {
                done(err);
            }
            finally
            {
                // gracefully shutdown nightmare driver
                nightmareDriver();
            };

        });
    });
    it ('should NOT get Google title', function (done) {
        var nightmareDriver = NightmareElectron();
        var x = Xray().driver(nightmareDriver);
        x('http://www.phulas.com', 'title')(function(err,title) {
            console.log('Title scraped is: ' + title);
            // assert will throw an error if it fails because this is an async
            try{
                assert.notEqual(title, 'Google' );
                done();
            }
                // if assertion fails, error thrown so catch it so it isn't a timeout problem
            catch (err) {
                done(err);
            }
            finally
            {
                // gracefully shutdown nightmare driver
                nightmareDriver();
            };

        });
    });
});


