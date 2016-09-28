angular.module('mineSweeper')
.factory('indexUtil', [function(){
    //
    // Utility to deal with element index for a 2d grid stored as a 1d array
    //
    var IndexCalcMixin = {
        getIndex: function(i,j){
            return j*this.width + i;
        },
        neighborIndexes: function(centerIdx){
            var neighborIndexes = [];
            var mod = centerIdx % this.width;
            switch(mod){
                case 0:
                    //left edge
                    neighborIndexes = this._dumbNeighborIndexes(centerIdx, ['top', 'topright', 'right', 'botright', 'bot']);
                    break;
                case (this.width -1):
                    //right edge
                    neighborIndexes = this._dumbNeighborIndexes(centerIdx, ['top','bot','botleft','left','topleft']);
                    break;
                default:
                    //all Tiles in between
                    neighborIndexes = this._dumbNeighborIndexes(centerIdx, ['top','topright','right','botright','bot','botleft','left','topleft']);
            }
            return neighborIndexes;
        },
        _dumbNeighborIndexes: function(centerIdx, directions){
            //
            // return all valid neighboring indexes specified by directions.
            // valid -> within 0 .. gridCount, otherwise this function is dumb at edges
            //

            var w = this.width;
            var gridCount = this.gridCount;
            var indexes = directions.map(function(dir){
                switch(dir){
                    case 'topleft':
                        return centerIdx - w -1;
                    case 'top':
                        return centerIdx - w;
                    case 'topright':
                        return centerIdx - w + 1;
                    case 'right':
                        return centerIdx +1;
                    case 'botright':
                        return centerIdx + w + 1;
                    case 'bot':
                        return centerIdx + w;
                    case 'botleft':
                        return centerIdx + w - 1;
                    case 'left':
                        return centerIdx -1;
                    default:
                        throw "Invalid direction: " + dir;
                }
            }).filter(function(idx){
                // true if idx within 0 .. gridCount
                return idx >= 0 && idx < gridCount;
            });
            return indexes;
        }
    };

    return {
        newIndexCalculator: function(gridWidth, gridHeight){
            var indexCalc = {
                width: gridWidth,
                height: gridHeight,
                gridCount: gridWidth * gridHeight
            };

            return angular.extend(indexCalc, IndexCalcMixin);
        }
    };
}]);
