define(['angular', 'imagesLoaded'], function(angular, imagesLoaded) {

  // directive which simply shows the element when the images
  // contained within have finished loading.
  // angular.module('directives', []).directive('imageLoadShow', ['$animate', '$timeout', function($animate, $timeout) {
  //   return function(scope, element, attrs) {
  //     element.addClass('ng-hide');
  //     imagesLoaded(element[0], function() {
  //       $animate.removeClass(element, 'ng-hide');
  //     });
  //   };
  // }]);

  angular.module('bm.directives', []).directive('bmImagesLoaded', ['$animate', '$parse', '$log', function($animate, $parse, $log) {
    // Find all the nested elements with class ng-hide
    return function(scope, element, attrs) {
      imagesLoaded(element[0], function() {
        $log.info("All images loaded");
        var fn = $parse(attrs.bmImagesLoaded);
        scope.$apply(fn);
      });
    }
  }]);
});
