angular.module('mineSweeper')
.factory('notifyUtil', ['$rootScope', function($rootScope){
    var notifyUtil = {
        notifyGameEnded: function(status){
            $rootScope.$emit('game-ended', status);
        },
        notifyNewGame: function(status){
            $rootScope.$emit('new-game', status);
        }
    };

    return notifyUtil;
}]);
