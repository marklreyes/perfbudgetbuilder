// # Scope Decorator: $onRootScope
// Decorates the `$rootScope` with an `$onRootScope` method as suggested [here][1]

/**
 * @param  {[type]} $provide [description]
 * @return {[type]}          [description]
 */
perfBudget.config(['$provide', function($provide){
    $provide.decorator('$rootScope', ['$delegate', function($delegate){

        $delegate.$onRootScope = function(name, listener){
            var unsubscribe = $delegate.$on(name, listener);
            this.$on('$destroy', unsubscribe);
        };

        return $delegate;
    }]);
}]);

// ## References
// [What's the correct way to communicate between controllers in AngularJS?][1]
// [1]: http://stackoverflow.com/questions/11252780/whats-the-correct-way-to-communicate-between-controllers-in-angularjs/19498009#19498009 "$onRootScope"
// [Object.defineProperty() Documentation][2]
// [2]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty "Object.defineProperty()"
