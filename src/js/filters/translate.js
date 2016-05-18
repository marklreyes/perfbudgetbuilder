 /*************************************************
 * TRANSLATION FILTER
 *
 * A filter was not a good choice for translations. A directive may have been more suitable.
 * In the end, the translations were pre-built so the choice didn't have any real impact.
 *
 *************************************************/
(function(app) {
	app.filter('translate',
		['appSettings', '$window',
		function(appSettings, $window){
			return function(input) {
				var i18n = $window.ltAccountLocalization;

				var out = i18n;
				var parts = input.split('.');
				var i = 0;
				var args = Array.prototype.slice.call(arguments, 1);

				while(typeof parts[i] !== 'undefined' && typeof out !== 'undefined' && parts[i] in out) {
					out = out[parts[i]];
					i++;
				}

				if(typeof out === 'function') {
					out = out.apply(null, args);
				}

				return typeof out == 'string' ? out : input;
			};
		}
	]);
}(window.perfBudget));
