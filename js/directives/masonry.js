define(['masonry', 'imagesLoaded', 'lodash'], function(Masonry, imagesLoaded, _) {
  'use strict';
  angular.module('bm.directives', []).controller('MasonryCtrl', [
    '$scope',
    '$element',
    '$timeout',
    '$log',
    function controller($scope, $element, $timeout, $Log) {
      var bricks = {};
      var schedule = [];
      var destroyed = false;
      var self = this;
      var timeout = null;

      this.preserveOrder = false;
      this.scheduleMasonryOnce = function scheduleMasonryOnce(eventName) {
        var args = arguments;
        var found = schedule.filter(function filterFn(item) {
            return item[0] === args[0];
          }).length > 0;
        if (!found) {
          this.scheduleMasonry.apply(null, arguments);
        }
      };
      this.scheduleMasonry = function scheduleMasonry() {
        if (timeout) {
          $timeout.cancel(timeout);
        }
        schedule.push([].slice.call(arguments));
        timeout = $timeout(function runMasonry() {
          if (destroyed) {
            return;
          }
          schedule.forEach(function scheduleForEach(args) {
            var masonryInstance = Masonry.data($element[0]);
            var fn = masonryInstance[args[0]];
            if (_.isFunction(fn))
              fn.apply(masonryInstance, args);

            // if (masonryInstance)
            //   masonryInstance.apply($element[0], args);
            //   // masonryInstance(args[0]);

            // masonryInstance[args[0]]
            // if (masonryInstance) {
            //   try {
            //     Masonry.apply(masonryInstance, args);
            //   }
            //   catch (e) {
            //     $log.error("Invalid masonry instance");
            //   }
            // }
            // $element.masonry.apply($element, args);
          });
          schedule = [];
        }, 30);
      };
      function defaultLoaded($element) {
        $element.addClass('loaded');
      }
      this.appendBrick = function appendBrick(element, id) {
        if (destroyed) {
          return;
        }
        function _append() {
          var masonryInstance = Masonry.data($element[0]);
          if (Object.keys(bricks).length === 0) {
            masonryInstance.resize();
          }
          if (bricks[id] === undefined) {
            bricks[id] = true;
            defaultLoaded(element);
            masonryInstance.appended(element);
          }
        }
        function _layout() {
          self.scheduleMasonryOnce('layout');
        }
        if (self.preserveOrder) {
          _append();
          imagesLoaded(element, _layout);
        } else {
          imagesLoaded(element, function() {
            _append();
            _layout();
          });
        }
      };
      this.removeBrick = function removeBrick(id, element) {
        var masonryInstance = Masonry.data($element[0]);

        if (destroyed) {
          return;
        }
        delete bricks[id];
        masonryInstance.remove(element);
        this.scheduleMasonryOnce('layout');
      };
      this.destroy = function destroy() {
        destroyed = true;
        if ($element.data('masonry')) {
          $element.masonry('destroy');
        }
        $scope.$emit('masonry.destroyed');
        bricks = [];
      };
      this.reload = function reload() {
        $element.masonry();
        $scope.$emit('masonry.reloaded');
      };
    }
  ]).directive('masonry', function masonryDirective() {
    return {
      restrict: 'AE',
      controller: 'MasonryCtrl',
      link: {
        pre: function preLink(scope, element, attrs, ctrl) {
          var attrOptions = scope.$eval(attrs.masonry || attrs.masonryOptions);
          var options = angular.extend({
              itemSelector: attrs.itemSelector || '.masonry-brick',
              columnWidth: parseInt(attrs.columnWidth, 10)
            }, attrOptions || {});

          // Make the element a Masonry element
          new Masonry(element[0], options);

          // element.masonry(options);
          var preserveOrder = scope.$eval(attrs.preserveOrder);
          ctrl.preserveOrder = preserveOrder !== false && attrs.preserveOrder !== undefined;
          scope.$emit('masonry.created', element);
          scope.$on('$destroy', ctrl.destroy);
        }
      }
    };
  }).directive('masonryBrick', function masonryBrickDirective() {
    return {
      restrict: 'AC',
      require: '^masonry',
      scope: true,
      link: {
        pre: function preLink(scope, element, attrs, ctrl) {
          var id = scope.$id, index;
          ctrl.appendBrick(element, id);
          element.on('$destroy', function () {
            ctrl.removeBrick(id, element);
          });
          scope.$on('masonry.reload', function () {
            ctrl.reload();
          });
          scope.$watch('$index', function () {
            if (index !== undefined && index !== scope.$index) {
              ctrl.scheduleMasonryOnce('reloadItems');
              ctrl.scheduleMasonryOnce('layout');
            }
            index = scope.$index;
          });
        }
      }
    };
  });
});
