angular.module('mineSweeper')
.directive('gridDisplay', ['gridState','$rootScope', function(gridState, $rootScope){
    return {
        restrict: 'E',
        replace: true,
        templateUrl: 'templates/gridDisplay.html',
        link: function(scope, elm, attrs){
            function redrawGrid(){
                scope.rowIndexes = _.range(gridState.getHeight());
                scope.columnIndexes = _.range(gridState.getWidth());
                scope.gridSize = gridState.getWidth() + 'x' + gridState.getHeight();
            }

            scope.getTileValue = function(i,j){
                return gridState.getMaskedTileValue(i,j)
            }
            scope.isVisibleMine = function(i,j){
                return gridState.isXrayOn() && gridState.isMineTile(i,j);
            }

            scope.expandTile = function(i,j){
                if(gridState.isGameInProgress()){
                    gridState.expandTile(i,j);
                }
            }

            $rootScope.$on('new-game', function(){
                redrawGrid();
            });
            redrawGrid();
        }
    }
}])
