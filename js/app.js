/**
 * The main app module
 *
 * @type {angular.Module}
 */
require([
  'angular',
  'angular-animate',
  'angular-route',
  'angular-bootstrap',
  'firebase',
  'angular-fire',
  'imagesLoaded',
  'masonry',
  'css!css/bootstrap',
  'css!//netdna.bootstrapcdn.com/font-awesome/4.0.3/css/font-awesome.css',
  'css!css/app'
  ], function(angular) {
  'use strict';

  define("barnstormer-app", function(require) {
    require('asset!js/directives/masonry');
    require('asset!js/directives/imagesLoadShow');
    require('asset!js/services/lastfm');

    // The string arguments to the require function call must be
    // string literals, not JavaScript expressions.
    var views = {
      index: {
        controller: require('asset!js/controllers/indexCtrl'),
        template: require('asset!partials/index')
      },
      artist: {
        controller: require('asset!js/controllers/artistCtrl'),
        template: require('asset!partials/artist')
      }
    };


    // The aerobatic service is a built-in Angular service.
    var app = angular.module('barnstormer-music', ['ngRoute', 'ngAnimate', 'ui.bootstrap', 'firebase', 'aerobatic', 'bm.services', 'bm.directives']);

    app.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
      // Use the bang prefix for Google ajax crawlability
      // https://developers.google.com/webmasters/ajax-crawling/docs/specification?csw=1
      $locationProvider.hashPrefix('!');

      $routeProvider
        .when('/', views.index)
        .when('/artist/:artistName', views.artist)
        .otherwise({redirectTo: '/'});
    }]);

    app.controller('MainCtrl', require('asset!js/controllers/mainCtrl'));

    app.run(['$rootScope', '$log', '$window', function($rootScope, $log, $window) {
      $log.info("Angular run event");

      $rootScope.$on('$viewContentLoaded', function() {
        // Scroll back to the top of the window whenver the view changes.
        $window.scrollTo(0, 0);
      });

      $rootScope.artistUrl = function(artist) {
        return '#!/artist/' + encodeURIComponent(artist.name);
      };
    }]);

    // app.factory('LastFm', ['$http', function($http) {
    //   return function(method, params, cacheTtl) {
    //
    //     // @@LASTFM_API_KEY@@ is token that will get replaced by the Aerobatic proxy
    //     var url = "/proxy?url=";
    //     url += encodeURIComponent("http://ws.audioscrobbler.com/2.0?method=" + method + "&api_key=@@LASTFM_API_KEY@@&format=json");
    //     if (cacheTtl)
    //       url += "&cache=1&key=" + method + "&ttl=" + cacheTtl;
    //
    //     return $http({method: 'GET', url: url});
    //   };
    // }]);

    angular.element(document).ready(function() {
      // Append an ng-view to the body to load our partial views into
      angular.element(document.body).append(angular.element(require('asset!partials/layout')));
      angular.bootstrap(document, ['barnstormer-music']);
    });

    return app;
  });

  // We need to require these after we are assured that angular is available
  // angular-aerobatic is a module built-in to Aerobatic that registers
  // the aerobatic Angular service.
  require(['angular-aerobatic', 'barnstormer-app']);
});
