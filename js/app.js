angular.module('mineSweeper', [])
.constant('_', window._)
.run(['$rootScope', function($rootScope){
    //
    // put lodash into root scope for convenience
    $rootScope._ = window._;
}])
.controller('appCtrl', ['$rootScope', '$scope','gridState', function($rootScope, $scope, gridState){
    $scope.validateEndGame = function(){
        // end game one way or another
        gridState.validateEndGame();
    }

    $scope.gameLevels = gridState.getGameLevels();
    $scope.input = {selectedLevel: $scope.gameLevels[0].value};
    $scope.startNewGame = function(){
        gridState.startNewGame($scope.input.selectedLevel);
    }

    //
    // cheat mode. hold xray button to reveal mine
    // release to hide
    $scope.xrayOn = function(){
        gridState.setXray(true);
    }
    $scope.xrayOff = function(){
        gridState.setXray(false);
    }

    $scope.gameStatus = null;
    $rootScope.$on('game-ended', function(scope, status){
        $scope.gameStatus = status;

        //
        // when game ends, reveal mines
        gridState.setXray(true);
    });
    $rootScope.$on('new-game', function(scope, status){
        $scope.gameStatus = status;
    })

}]);
