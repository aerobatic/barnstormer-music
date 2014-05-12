define(['angular', 'asset!js/qs'], function(angular, qs) {
  'use strict';

  // In reality the thing service would probably use a web API. You might want to bring in the ngResource
  // service as a dependency.
  // angular.module('services', ['ngResource']).factory('resources', ['$resource', function($resource) {
  //  return $resource("http://thing-api/things/:thingId", { thingId: '@thingId'});
  // });

  angular.module('bm.services', []).factory('LastFm', ['$http', function($http) {
    return function(method, apiParams, cacheTtl) {
      // @@LASTFM_API_KEY@@ is token that will get replaced by the Aerobatic proxy

      var params = _.extend(apiParams || {}, {
        api_key: '@@LASTFM_API_KEY@@',
        format: 'json'
      });

      var proxyParams = {
        url: "http://ws.audioscrobbler.com/2.0?method=" + method + "&" + qs.stringify(params)
      };

      if (cacheTtl){
        proxyParams.cache = 1,
        proxyParams.key = method + qs.stringify(params),
        proxyParams.ttl = cacheTtl;
      }

      return $http({method: 'GET', url: "/proxy?" + qs.stringify(proxyParams)});
    }
  }]);
});
