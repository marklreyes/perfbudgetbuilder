/*************************************************
 * GOOGLE PAGESPEED SERVICE
 *
 * https://developers.google.com/speed/docs/insights/v2/first-app#example_javascript
 *
 * This will return a script tag with the JSONP callback
 * as its source. Apply JSONP technique to evaluate response.
 *************************************************/
(function(app) {
    "use strict";

    app.service('PageSpeedService', ['$rootScope', '$http', '$q', '$window',
        function($rootScope, $http, $q, $window) {

            // FIRST, specify your Google API key:
            var API_KEY = 'YOURAPIKEYGOES HERE';

            // NEXT, fetch PageSpeed Results from the PageSpeed Insights API
            var API_URL = 'https://www.googleapis.com/pagespeedonline/v2/runPagespeed?';
            var CHART_API_URL = 'http://chart.apis.google.com/chart?';

            // Invokes the PageSpeed Insights API. The response will contain
            // JavaScript that invokes our callback with the PageSpeed results.
            function runPagespeed(URL_TO_GET_RESULTS_FOR) {
                var s = document.createElement('script');
                s.id = 'jsonSource';
                s.type = 'text/javascript';
                s.async = true;
                var query = [
                    'url=' + URL_TO_GET_RESULTS_FOR,
                    'callback=JSON_CALLBACK',
                    'key=' + API_KEY,
                ].join('&');
                s.src = API_URL + query;
                document.head.insertBefore(s, null);
            }

            // Public methods
            this.runPagespeed = runPagespeed;
        }
    ]);
}(window.perfBudget));
