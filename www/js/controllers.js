angular.module('starter.controllers', [])

.controller('NearMissesCtrl', function($scope, $timeout, $cordovaDeviceMotion, $filter, DecelerationDB, AccountSettings, $firebaseArray, GraphData, AccelerometerData) {
  var accel = null;
	$scope.showAdvData = false;

  $scope.decels = DecelerationDB;
  $scope.accelsData = AccelerometerData;

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
  document.addEventListener("pause", onPause, false);

  function onPause() {
    $scope.accelsData.$add({
            "accelData":       GraphData.accelerometerData,
            "firebaseTimestamp": Firebase.ServerValue.TIMESTAMP
          });
  }

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
        var threshold = 6.75;
        $scope.getAccelFreq++
        $scope.lastZResult = $scope.currentAccelZ;
        $scope.currentAccelX = result.x;
        $scope.currentAccelY = result.y;
        $scope.currentAccelZ = result.z;
        $scope.timestamp = $filter('date')(result.timestamp, 'medium', '+1000');

        GraphData.addEntry([result.timestamp, $scope.currentAccelZ]);

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
            "timestamp":  result.timestamp,
            "firebaseTimestamp": Firebase.ServerValue.TIMESTAMP
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

.controller('StatsCtrl', function($scope, GraphData) {
  $scope.showGraph = 'decelCount';

  $scope.selectDecelCount = function() {
    $scope.showGraph = 'decelCount';
  };

  $scope.selectAccelGraph = function() {
    $scope.showGraph = 'accelGraph';
  };

  $scope.options = {
    chart: {
        type: 'historicalBarChart',
        height: 450,
        margin : {
            top: 20,
            right: 20,
            bottom: 60,
            left: 50
        },
        x: function(d){return d[0];},
        y: function(d){return d[1]/100000;},
        showValues: true,
        valueFormat: function(d){
            return d3.format(',.1f')(d);
        },
        transitionDuration: 500,
        xAxis: {
            axisLabel: 'X Axis',
            tickFormat: function(d) {
                return d3.time.format('%x')(new Date(d))
            },
            rotateLabels: 50,
            showMaxMin: false
        },
        yAxis: {
            axisLabel: 'Y Axis',
            axisLabelDistance: 35,
            tickFormat: function(d){
                return d3.format(',.1f')(d);
            }
        }
    }
  };

  $scope.data = [
      {
          "key" : "Quantity" ,
          "bar": true,
          "values" : [ [ 1136005200000 , 1271000.0] , [ 1138683600000 , 1271000.0] , [ 1141102800000 , 1271000.0] , [ 1143781200000 , 0] , [ 1146369600000 , 0] , [ 1149048000000 , 0] , [ 1151640000000 , 0] , [ 1154318400000 , 0] , [ 1156996800000 , 0] , [ 1159588800000 , 3899486.0] , [ 1162270800000 , 3899486.0] , [ 1164862800000 , 3899486.0] , [ 1167541200000 , 3564700.0] , [ 1170219600000 , 3564700.0] , [ 1172638800000 , 3564700.0] , [ 1175313600000 , 2648493.0] , [ 1177905600000 , 2648493.0] , [ 1180584000000 , 2648493.0] , [ 1183176000000 , 2522993.0] , [ 1185854400000 , 2522993.0] , [ 1188532800000 , 2522993.0] , [ 1191124800000 , 2906501.0] , [ 1193803200000 , 2906501.0] , [ 1196398800000 , 2906501.0] , [ 1199077200000 , 2206761.0] , [ 1201755600000 , 2206761.0] , [ 1204261200000 , 2206761.0] , [ 1206936000000 , 2287726.0] , [ 1209528000000 , 2287726.0] , [ 1212206400000 , 2287726.0] , [ 1214798400000 , 2732646.0] , [ 1217476800000 , 2732646.0] , [ 1220155200000 , 2732646.0] , [ 1222747200000 , 2599196.0] , [ 1225425600000 , 2599196.0] , [ 1228021200000 , 2599196.0] , [ 1230699600000 , 1924387.0] , [ 1233378000000 , 1924387.0] , [ 1235797200000 , 1924387.0] , [ 1238472000000 , 1756311.0] , [ 1241064000000 , 1756311.0] , [ 1243742400000 , 1756311.0] , [ 1246334400000 , 1743470.0] , [ 1249012800000 , 1743470.0] , [ 1251691200000 , 1743470.0] , [ 1254283200000 , 1519010.0] , [ 1256961600000 , 1519010.0] , [ 1259557200000 , 1519010.0] , [ 1262235600000 , 1591444.0] , [ 1264914000000 , 1591444.0] , [ 1267333200000 , 1591444.0] , [ 1270008000000 , 1543784.0] , [ 1272600000000 , 1543784.0] , [ 1275278400000 , 1543784.0] , [ 1277870400000 , 1309915.0] , [ 1280548800000 , 1309915.0] , [ 1283227200000 , 1309915.0] , [ 1285819200000 , 1331875.0] , [ 1288497600000 , 1331875.0] , [ 1291093200000 , 1331875.0] , [ 1293771600000 , 1331875.0] , [ 1296450000000 , 1154695.0] , [ 1298869200000 , 1154695.0] , [ 1301544000000 , 1194025.0] , [ 1304136000000 , 1194025.0] , [ 1306814400000 , 1194025.0] , [ 1309406400000 , 1194025.0] , [ 1312084800000 , 1194025.0] , [ 1314763200000 , 1244525.0] , [ 1317355200000 , 475000.0] , [ 1320033600000 , 475000.0] , [ 1322629200000 , 475000.0] , [ 1325307600000 , 690033.0] , [ 1327986000000 , 690033.0] , [ 1330491600000 , 690033.0] , [ 1333166400000 , 514733.0] , [ 1335758400000 , 514733.0]]
      }];

  $scope.accelGraphOptions = {
    chart: {
        type: 'lineChart',
        height: 200,
        margin : {
            top: 20,
            right: 20,
            bottom: 60,
            left: 50
        },
        x: function(d){return d[0];},
        y: function(d){return d[1]/100000;},
        showValues: true,
        valueFormat: function(d){
            return d3.format(',.1f')(d);
        },
        transitionDuration: 500,
        xAxis: {
            axisLabel: 'X Axis',
            tickFormat: function(d) {
                return d3.time.format('%x')(new Date(d))
            },
            rotateLabels: 50
        },
        yAxis: {
            axisLabel: 'Y Axis',
            axisLabelDistance: 2,
            tickFormat: function(d){
                return d3.format(',.1f')(d);
            }
        }
    }
  };

  // values: [time, data]
  $scope.accelGraphData = GraphData.accelGraphData;

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
