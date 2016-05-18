/*************************************************
 * numbersOnly DIRECTIVE
 *
 * Assign this directive to input elements
 * which will make them enter integers only, 0-9.
 *
 * Based off of, https://jsfiddle.net/jamseernj/6guy3sp9/
 * <input type="text" numbers-only>
 *
 *************************************************/
(function(app) {
    app.directive('numbersOnly', function() {
        return {
            require: '?ngModel',
            link: function(scope, element, attrs, ngModelCtrl) {
                if (!ngModelCtrl) {
                    return;
                }

                ngModelCtrl.$parsers.push(function(val) {
                    if (angular.isUndefined(val)) {
                        var val = '';
                    }

                    var clean = val.replace(/[^0-9]/g, '');
                    var negativeCheck = clean.split('-');
                    if (!angular.isUndefined(negativeCheck[1])) {
                        negativeCheck[1] = negativeCheck[1].slice(0, negativeCheck[1].length);
                        clean = negativeCheck[0] + '-' + negativeCheck[1];
                        if (negativeCheck[0].length > 0) {
                            clean = negativeCheck[0];
                        }
                    }

                    if (val !== clean) {
                        ngModelCtrl.$setViewValue(clean);
                        ngModelCtrl.$render();
                    }
                    return clean;
                });

                element.bind('keypress', function(event) {
                    if (event.keyCode === 32) {
                        event.preventDefault();
                    }
                });
            }
        };
    });
}(window.perfBudget));
