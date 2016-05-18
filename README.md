# Performance Budget Builder
This easy-to-use tool allows you to scan a URL and view the size of the assets that make up your webpage.

You can then set a size budget for your page, plugging in sizes for each asset category that will load on the page. The tool will adjust each category’s width accordingly and yell at you if you exceed your budget.

## Dependencies
* [gulp] (https://github.com/gulpjs/gulp/blob/master/docs/getting-started.md)
* [Google API key] (https://developers.google.com/speed/docs/insights/v1/getting_started#auth)

## Usage
You will need to specify a [Google API key](https://developers.google.com/speed/docs/insights/v2/first-app#auth) for Pagespeed Insights API. Once generated, place that into JS file, `pageSpeedService.js`

    var API_KEY = 'YOURAPIKEYGOES HERE';


Build out `pageSpeedService.js` by navigating to the root directory of this project and running `gulp` on the command line

    $ gulp


The application is invoked purely through JavaScript and leverages a callback via JSONP, hence no server-side code.

## Technology Stack
* [AngularJS v1.5.0] (https://code.angularjs.org/1.5.0/docs/api)
* [Bootstrap v3.3.6] (http://getbootstrap.com)

## View Demo
[View Demo](https://marklreyes.com/demos/performancebudgetbuilder/)

## Credits
[Brad Frost](http://bradfrost.com/blog/post/performance-budget-builder/) for the original prototype.
