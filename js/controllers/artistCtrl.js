
define(['angular'], function(angular){
  function ArtistCtrl($scope, $routeParams, $sce, LastFm) {
    'use strict';

    var artistName = $routeParams['artistName'];
    $scope.artistLoaded = false;

    // Fetch the artist details and cache for 5 minutes
    LastFm('artist.getInfo', {artist: artistName}, 300).success(function(data) {
      $scope.artist = data.artist;

      $scope.similarArtists = _.sortBy(data.artist.similar.artist, _.random(1, data.artist.similar.artist.length));
      $scope.bio = $sce.trustAsHtml(data.artist.bio.summary);
      $scope.artistLoaded = true;
    });

    // $scope.onImagesLoaded = function() {
    //   $scope.imagesLoaded = true;
    // }

    $scope.masonryOptions = {
      transform: 'scale(0.001)',
      visibleStyle: { opacity: 1, transform: 'scale(1)' },
      hiddenStyle: { opacity: 0, transform: 'scale(0.001)' },
      transitionDuration: '0.4s'
    };
  };

  ArtistCtrl.$inject = ['$scope', '$routeParams', '$sce', 'LastFm'];
  return ArtistCtrl;
});
