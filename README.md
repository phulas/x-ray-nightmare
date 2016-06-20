# x-ray-nightmare
Nightmare (electron based) driver for the [x-ray](https://github.com/lapwinglabs/x-ray) web scraper.

This is an alternative to the [x-ray-phantom](https://github.com/lapwinglabs/x-ray-phantom) driver created by x-ray author [@matthewmueller](https://github.com/matthewmueller).

## Installation

```
npm install x-ray-nightmare
```

## Usage

```js
var NightmareElectron = require('x-ray-nightmare');
var Xray = require('x-ray');

// instantiate driver for later shutdown
var nightmareDriver = NightmareElectron();

var x = Xray()
  .driver(nightmareDriver);

x('http://google.com', 'title')(function(err, str) {
  if (err) return done(err);
  assert.equal('Google', str);
  
  // gracefully shutdown driver
  nightmareDriver();
  
  done();
})
```

## API

### NightmareElectron([options|fn], [fn])

Initialize the NightmareElectron driver with `options` being passed to Nightmare and
an optional custom `fn` with the signature `function(ctx,nightmare)`.

Returns the driver object which must be called as a function once when no longer needed
in order to gracefully shut down the nightmare object (results in a call to the Nightmare [.end()](https://github.com/segmentio/nightmare#end) function)

##### Options

Options that can be passed to nightmare are documented [here](https://github.com/segmentio/nightmare#nightmareoptions).

##### Optional function

By default, a simple page visit by using Nightmare to the URL specified is executed

```js
// Assume that a nightmare object is instantiated with
// options as (if) specified
// var Nightmare = require('nightmare');
// var nightmare = new Nightmare(options);

nightmare.goto(ctx.url);

```

A custom function to, lets say, take a screenshot and save the file, would replace this simple Nightmare call with this:

```js
// take a screenshot before passing output to x-ray
function getScreenshot(ctx, nightmare) {
    nightmare.goto(ctx.url)
       .screenshot('page.png');
}

// alternate instantiation of x
var x = Xray()
  .driver(NightmareElectron(getScreenshot));


```
Note that the page html is passed off to x-ray and  `nightmare.end()` is executed by the driver, so there is no need to add this to your custom function.

## Test

```
npm install 
npm install -only=dev

#run mocha on test.js file

```

## Debug Flags

All x-ray-nightmare messages:

`DEBUG=x-ray:nightmare*`


## License

MIT
