/*************************************************
 * LOADER DIRECTIVE
 *
 * Reusable loader element
 *
 * Usage:
 *  - <span loader></span>, <div loader></div>, <button loader></button>, etc.
 *  - Determine if element displays from a controller with, $scope.processStatus=='loading'
 *
 *  <div ng-show="processStatus=='loading'">
 *      <span loader></span>
 *  </div>
 *************************************************/
(function(app) {
	app.directive('loader', function() {
		return {
			restrict: 'A',
			priority: 1,
			link: function(scope, element, attrs) {

				var $element = $(element);

				element.html(
					'<div class="text-center loader">'+
						'<div class="loading-wheel-block">'+
							'<span class="loading-wheel loading-wheel-lg"></span>'+
						'</div>'+
					'</div>'
				);

			}
		};
	});
}(window.perfBudget));
