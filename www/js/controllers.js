angular.module('starter.controllers', [])

.controller('NearMissesCtrl', function($scope, $timeout, $cordovaDeviceMotion, $filter, DecelerationDB, AccountSettings) {
  var accel = null;
	$scope.showAdvData = false;

  $scope.decels = DecelerationDB;

  $scope.currentAccelX = 0;
  $scope.currentAccelY = 0;
  $scope.currentAccelZ = 0;
  $scope.timestamp = '';

  $scope.getAccelFreq = 0;

  $scope.suddenAccelCount = 0;
  $scope.suddenDecelCount = 0;
  $scope.currentlyAccel = false;
  $scope.currentlyDecel = false;
  $scope.lastZResult = 0;

  // watch Acceleration
  

  document.addEventListener("deviceready", onDeviceReady, false);

  function onDeviceReady() {
    startAccelerometer();

    // TODO: FIX as not working
    // $timeout(function() {
    //   stopAccelerometer();
    // }, 10000)
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
          $scope.suddenAccelCount++;      // Increment acceleration counter
          $scope.currentlyAccel = true;
          $scope.currentlyDecel = false;
        } else if (result.z >= -threshold && result.z <= threshold && $scope.lastZResult >= -threshold && $scope.lastZResult <= threshold) {
          $scope.currentlyAccel = false;
          $scope.currentlyDecel = false;
        } else if (result.z > threshold && $scope.lastZResult <= threshold) {
          $scope.suddenDecelCount++;              // Increment deceleration counter
          $scope.currentlyAccel = false;
          $scope.currentlyDecel = true;

          // Send data to Firebase
          $scope.decels.$add({
            "user":       AccountSettings.user,
            "doctor":     AccountSettings.doctor,
            "eventType":  "deceleration",
            "eventValue": result.z, 
            "timestamp":  result.timestamp
          });
        } else if (result.z > threshold && $scope.lastZResult > threshold) {
          $scope.currentlyAccel = false;
          $scope.currentlyDecel = true;
        }
      }
    )
  };

  // TODO: FIX as not working
  // function stopAccelerometer() {    
  //   if (accel) {
  //     $cordovaDeviceMotion.clearWatch(accel);
  //     accel = null;
  //   }
  // }

})

.controller('StatsCtrl', function($scope) {

})

.controller('InfoCtrl', function($scope, Chats) {
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

.controller('SettingsCtrl', function($scope, AccountSettings) {

  $scope.user = AccountSettings.user;
  $scope.doctor = AccountSettings.doctor;

});
