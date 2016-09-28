angular.module('mineSweeper')
.factory('notifyUtil', ['$rootScope', function($rootScope){
    var notifyUtil = {
        notifyGameEnded: function(status){
            $rootScope.$emit('game-ended', status);
        },
        notifyNewGame: function(){
            $rootScope.$emit('new-game');
        }
    };

    return notifyUtil;
}]);
