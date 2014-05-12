
define(['angular', 'lodash'], function(angular, _){

  function IndexCtrl($scope, $location, LastFm, $firebase, $aerobatic, $log) {
    'use strict';

    $scope.masonryOptions = {
      columnWidth: 277,
      transform: 'scale(0.001)',
      visibleStyle: { opacity: 1, transform: 'scale(1)' },
      hiddenStyle: { opacity: 0, transform: 'scale(0.001)' },
      transitionDuration: '0.4s',
      gutter: 10
    };

    // $scope.artistsLoading = true;
    LastFm('chart.topArtists', {}, 300).success(function(data, status, headers) {
      // aerobatic-from-cache

      $scope.artistsLoading = false;
      // Randomize the order of the artists
      $scope.topArtists = _.sortBy(data.artists.artist, function() { return _.random(1, 100)});
    });

    // $scope.things = Thing.list();

    // $scope.loadThing = function(id, $event) {
    //   $location.path(id);
    //   $event.preventDefault();
    // }
    //
    // var userId = "user_123";
    // $scope.items = $firebase(new Firebase($aerobatic.settings.FIREBASE_URL + "/" + userId + "/cart"));
    //
    // $scope.items.$add({foo: "bar"});
  };

  IndexCtrl.$inject = ['$scope', '$location', 'LastFm', '$firebase', '$aerobatic', '$log'];
  return IndexCtrl;
});
