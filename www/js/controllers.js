angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope, $timeout, $cordovaDeviceMotion, $filter) {

	$scope.accelOn = false;

  $scope.counter = 203910;

  $timeout(function() {
    $scope.counter = $scope.counter + 500000;
  },2500);

  $scope.currentAccelX = 0;
  $scope.currentAccelY = 0;
  $scope.currentAccelZ = 0;
  $scope.timestamp = ''

  $scope.getAccelFreq = 0

  // document.addEventListener("deviceready", function () {

  //   $cordovaDeviceMotion.getCurrentAcceleration().then(function(result) {
  //     var X = result.x;
  //     var Y = result.y;
  //     var Z = result.z;
  //     var timeStamp = result.timestamp;

  //     $scope.currentAccelX = X;
  //     $scope.currentAccelY = Y;
  //     $scope.currentAccelZ = Z;
  //     $scope.timestamp = timeStamp;

  //   }, function(err) {
  //     // An error occurred. Show a message to the user
  //     console.log("Couldn't get current Acceleration");
  //   });

  // }, false);

  // watch Acceleration
  var options = { frequency: 50 };

  document.addEventListener("deviceready", function () {

    var watch = $cordovaDeviceMotion.watchAcceleration(options);
    watch.then(
      null,
      function(error) {
      // An error occurred
      },
      function(result) {
        $scope.getAccelFreq++
        var X = result.x;
        var Y = result.y;
        var Z = result.z;
        var timeStamp = result.timestamp;

        $scope.currentAccelX = X;
        $scope.currentAccelY = Y;
        $scope.currentAccelZ = Z;
        $scope.timestamp = $filter('date')(timeStamp, 'medium', '+1000');
    });

    // watch.clearWatch();
    // // OR
    // $cordovaDeviceMotion.clearWatch(watch)
    //   .then(function(result) {
    //     // success
    //     }, function (error) {
    //     // error
    //   });

  }, false);

})

.controller('ChatsCtrl', function($scope, Chats) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});
  
  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  }
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});
