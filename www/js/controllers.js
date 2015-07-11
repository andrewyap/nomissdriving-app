angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope, $timeout, $cordovaDeviceMotion, $filter) {
  var accel = null;
	$scope.accelOn = false;

  $timeout(function() {
    stopAccelerometer();
  }, 10000);

  $scope.currentAccelX = 0;
  $scope.currentAccelY = 0;
  $scope.currentAccelZ = 0;
  $scope.timestamp = '';

  $scope.getAccelFreq = 0;

  $scope.suddenAccel = 0;
  $scope.suddenDecel = 0;
  $scope.currentlyAccel = false;
  $scope.currentlyDecel = false;
  $scope.lastZResult = 0;

  // watch Acceleration
  

  document.addEventListener("deviceready", onDeviceReady, false);

  function onDeviceReady() {
    startAccelerometer();
  }

  function startAccelerometer() {
    var options = { frequency: 50 };

    accel = $cordovaDeviceMotion.watchAcceleration(options);

    accel.then(
      null,
      function(error) {
        // An error occurred
      },
      function(result) {
        var threshold = 8;
        $scope.getAccelFreq++
        $scope.lastZResult = $scope.currentAccelZ;
        $scope.currentAccelX = result.x;
        $scope.currentAccelY = result.y;
        $scope.currentAccelZ = result.z;
        $scope.timestamp = $filter('date')(result.timestamp, 'medium', '+1000');

        if (result.z < -threshold && $scope.lastZResult < -threshold) {
          $scope.currentlyAccel = true;
          $scope.currentlyDecel = false;
        } else if (result.z < -threshold && $scope.lastZResult >= -threshold) {
          $scope.suddenAccel++;
          $scope.currentlyAccel = true;
          $scope.currentlyDecel = false;
        } else if (result.z >= -threshold && result.z <= threshold && $scope.lastZResult >= -threshold && $scope.lastZResult <= threshold) {
          $scope.currentlyAccel = false;
          $scope.currentlyDecel = false;
        } else if (result.z > threshold && $scope.lastZResult <= threshold) {
          $scope.suddenDecel++;
          $scope.currentlyAccel = false;
          $scope.currentlyDecel = true;
        } else if (result.z > threshold && $scope.lastZResult > threshold) {
          $scope.currentlyAccel = false;
          $scope.currentlyDecel = true;
        }
      }
    )
  };

  function stopAccelerometer() {
    if (accel) {
      $cordovaDeviceMotion.clearWatch(accel);
      accel = null;
    }
  }
  // var options = { frequency: 50 };

  // document.addEventListener("deviceready", function () {

  //   var watch = $cordovaDeviceMotion.watchAcceleration(options);
  //   watch.then(
  //     null,
  //     function(error) {
  //     // An error occurred
  //     },
  //     function(result) {
  //       $scope.getAccelFreq++
  //       var X = result.x;
  //       var Y = result.y;
  //       var Z = result.z;
  //       var timeStamp = result.timestamp;

  //       $scope.currentAccelX = X;
  //       $scope.currentAccelY = Y;
  //       $scope.currentAccelZ = Z;
  //       $scope.timestamp = $filter('date')(timeStamp, 'medium', '+1000');
  //   });

  //   // watch.clearWatch();
  //   // // OR
  //   // $cordovaDeviceMotion.clearWatch(watch)
  //   //   .then(function(result) {
  //   //     // success
  //   //     }, function (error) {
  //   //     // error
  //   //   });

  // }, false);

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
