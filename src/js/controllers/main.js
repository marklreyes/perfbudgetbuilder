perfBudget.controller('main', ['$scope', '$http', 'PageSpeedService', function($scope, $http, PageSpeedService) {

	// Loader Element
	// will display if assigned string, 'loading'
	$scope.processStatus = '';

	// Alert Element
	$scope.alert = false;

	// Templates to show on pageload
	$scope.template = {
		main: {
			show: true
		},
		searchbar: {
			show: false
		},
		dashboard: {
			show: false
		},
		budgetPanel: {
			show: false
		},
		assetsPanel: {
			show: false
		},
		graphPanel: {
			show: false
		}
	};

}]);
