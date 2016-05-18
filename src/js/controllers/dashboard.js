perfBudget.controller('dashboard', ['$scope', '$filter', function($scope, $filter) {

	// Use temp data for playing with calculations
	$scope.temp = {
		initialRequestBytes: '',
		totalProposedRequestBytes: '',
		totalActualRequestBytes: ''
	};

	$scope.initialPageSize = function(data){
		var html = parseInt(data.pageStats.htmlResponseBytes);
		var css = parseInt(data.pageStats.cssResponseBytes);
		var js = parseInt(data.pageStats.javascriptResponseBytes);
		var img = parseInt(data.pageStats.imageResponseBytes);
		var other = parseInt(data.pageStats.otherResponseBytes);

		var initialTotal = html + css + js + img + other;
		var initial = $filter('bytes')(initialTotal);

		// Set temp object to value
		$scope.temp.initialRequestBytes = initial;
	};

	//Set width of category
	function setCatWidths(element) {
		element.find('.b-cat input').each(function() {
			var $this = $(this),
				val = parseInt($this.val());
			$this.parent().width(calculateCatWidth(element, val) + '%');
		});
	}

	setCatWidths($('.b'));


	//Calculate Actual Template Size
	function calculateActualSize(element) {
		var inputs = $('.b-cat input'),
			numInputs = inputs.length,
			totalActualSize = 0;

		//Calculate total value from each category
		element.find('.b-cat input').each(function() {
			var val = parseInt($(this).val());
			totalActualSize = totalActualSize + val;
		});

		setActualSize(element, totalActualSize);

		//Check if actual size is over/under budget
		budgetOverUnder(element);
	}

	calculateActualSize($('.b'));

	//Calculate width
	function calculateCatWidth(element, val) {
		var actualSize = parseInt(element.find('.actual-size span').text());
		var categoryWidth = (val / actualSize) * 100;
		return categoryWidth;
	}

	//Set Actual Size
	function setActualSize(element, val) {
		actualSize = val;
		element.find('.actual-size span').text(val);
		// set the value to the temp object totalNewRequestBytes
		var elemValue = $('.actual-size span').text();
		$scope.temp.totalActualRequestBytes = elemValue;
	}

	//Determine if actual size is within budget
	function budgetOverUnder(element) {
		var budgetSize = parseInt(element.find('.b-size span input').val());
		var actualSize = parseInt(element.find('.actual-size span').text());
		var totalSize = actualSize / budgetSize;

		//If actual val is over budget
		if (totalSize > 1) {
			element.find('.b-header, .actual-size').addClass('has-error');
			element.find('.b-cat-container').width('100%');
		} else {
			element.find('.b-header, .actual-size').removeClass('has-error');
			element.find('.b-cat-container').width(totalSize * 100 + '%');
		}
	}

	budgetOverUnder($('.b'));

	$scope.calculateBudgetValue = function(value){

		//Set widths of categories
		setCatWidths($('#bargraph .b'));

		calculateActualSize($('#bargraph .b'));
	};

	$scope.adjustBudgetValue = function(element){
		//Adjust budget value
		budgetOverUnder($('#bargraph .b'));

	};
}]);
