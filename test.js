/**
 * Module Dependencies
 */

var chai = require ('chai');
var Xray = require('../x-ray');
var NightmareElectron = require('./');


/**
 * Tests
 */

var assert = chai.assert;
describe('X-ray-nightmare tests', function () {
    it ('should get Google title', function (done) {
        var x = Xray().driver(NightmareElectron());
        x('http://www.google.com', 'title')(function(err,title) {
            console.log('Title is: ' + title);
            assert.equal(title, 'Google' );
            done();
        });
    });
});


