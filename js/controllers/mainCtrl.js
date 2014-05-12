define(['angular'], function(angular) {
  var mainCtrl = function($rootScope, $scope) {
    $rootScope.shoppingCart = {
      items: []
    };
  };
  
  mainCtrl.$inject = ['$rootScope', '$scope'];

  return mainCtrl;
});
