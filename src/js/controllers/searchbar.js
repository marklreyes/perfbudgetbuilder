perfBudget.controller('searchBar', ['$scope', '$http', 'PageSpeedService', function($scope, $http, PageSpeedService) {

	// Search Field for URL
	$scope.searchField = {
		webpage: ''
	};

	// Reload the page
	// TODO: Make the views update in realtime
	$scope.startOver = function(){
		window.location.reload();
	};

	// Scan the URL with PageSpeed
	$scope.scan = function(){
		// if not empty string...display the results view
		// TODO: Strengthen the validation!
		if ( $scope.searchField.webpage !== '' ) {

			// dsiables scan button
			document.getElementById('btn-scan').disabled = true;

			// run pagespeed service to get JSONP callback
			PageSpeedService.runPagespeed($scope.searchField.webpage);

			// latch on to the callback's source
			var source = document.getElementById('jsonSource').src;

			// display loader
			$scope.processStatus = 'loading';

			// pass the source in for jsonp call
			$http.jsonp(source).
			success(function(data){

				// enable startover button, disable search input
				document.getElementById('btn-start-over').disabled = false;
				document.getElementById('searchSiteInput').disabled = true;

				// Assign data to $scope
				$scope.data = data;

				// Reset processStatus
				$scope.processStatus = '';

				// publish the dashboard view
				$scope.template.dashboard.show = true;
			}).
			error(function(data){

				// enable startover button, disable search input
				document.getElementById('btn-start-over').disabled = false;
				document.getElementById('searchSiteInput').disabled = true;

				$scope.data = "Request failed";
				$scope.processStatus = '';
				$scope.alert = true;
			});
		} else {
			// invalidate the form
			// TODO: leverage bootstrap alert UI
			console.log('ERROR: url is an empty string.');
		}
	};
}]);
