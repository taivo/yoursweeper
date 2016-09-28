angular.module('mineSweeper')
.factory('gridState', ['_', '$rootScope', 'indexUtil', 'notifyUtil',function(_, $rootScope, indexUtil, notifyUtil){
    var gridState = {
        width: 8,
        height: 8,
        mineBaseCount: 10,
        mineRandomFactor: 0.3, //true mineCount is generated from baseCount and randomFactor
        status: null,
        xray: false, //flag for cheat mode
        MINE: 'M',
        UNKNOWN: null,
        GAME_LOST: 'lost',
        GAME_WON: 'won',
        GAME_INPROGRESS: 'playing',
    };

    var gameLevels = [
        {value:'easy', width: 8, height: 8, mineBaseCount: 10},
        {value:'medium', width: 16, height: 16, mineBaseCount: 40},
        {value:'hard', width: 24, height: 24, mineBaseCount: 100}
    ]

    var indexCalc = null;
    var grid = [];

    var GridUtil = {
        generateMines: function(){
            var gridCount = gridState.width * gridState.height;
            var mineCount = Math.ceil(gridState.mineBaseCount * _.random( 1 - gridState.mineRandomFactor, 1 + gridState.mineRandomFactor, true));
            console.log(mineCount);
            return _.sampleSize(_.range(gridCount), mineCount);
        },
        generateGrid: function(){
            //
            // generate array of mine locations then place it in the grid.
            // location = 1-dim array index.
            //

            // reset all tiles to UNKNOWN
            grid = _.times(gridState.width * gridState.height, _.constant(gridState.UNKNOWN));
            indexCalc = indexUtil.newIndexCalculator(gridState.width, gridState.height);

            // generate and set mines
            GridUtil.generateMines().forEach(function(mineIdx){
                grid[mineIdx] = gridState.MINE;
            });

            //reset game status
            gridState.status = gridState.GAME_INPROGRESS;
        }
    };

    var TileUtil = {
        getTileValue: function(i,j){
            return grid[indexCalc.getIndex(i,j)];
        },
        isMineTile: function(i,j){
            return TileUtil.getTileValue(i,j) === gridState.MINE;
        },
        noMoreUnknown: function(){
            //true iff no unexplored tile left, false otherwise
            return (grid.indexOf(gridState.UNKNOWN) === -1);
        },
        recursiveExpandTile: function(centerIdx){
            //
            // expand tile if it's not yet explored or is a mine
            //
            if( grid[centerIdx] === null ){
                // expand this unexplored tile
                var neighbors = indexCalc.neighborIndexes(centerIdx);

                // count adjacent mines and set tile value
                grid[centerIdx] = neighbors.filter(function(idx){
                    return grid[idx] === gridState.MINE;
                }).length;

                // if tile value is 0, expand all neighbors
                if(grid[centerIdx] === 0){
                    neighbors.map(this.recursiveExpandTile, this);
                }
            } // else noop, tile already explored
        }
    };

    var GameUtil = {
        endGame: function(status){
            gridState.status = status;
            notifyUtil.notifyGameEnded(status);
        },
        startNewGame: function(level){
            var levelInfo = gameLevels.find(function(lev){
                return lev.value === level;
            });

            gridState.width = levelInfo.width;
            gridState.height = levelInfo.height;
            gridState.mineBaseCount = levelInfo.mineBaseCount;
            GridUtil.generateGrid();
            notifyUtil.notifyNewGame();

            //
            // turn off xray on new game
            gridState.xray = false;
        }
    }

    GridUtil.generateGrid();

    //
    // public interface for this service
    //
    var svc = {
        validateEndGame: function(){
            GameUtil.endGame( TileUtil.noMoreUnknown() ? gridState.GAME_WON : gridState.GAME_LOST );
        },
        isGameInProgress: function(){
            console.log('status', gridState.status);
            return gridState.status === gridState.GAME_INPROGRESS;
        },
        getGameLevels: function(){
            return gameLevels;
        },
        startNewGame: GameUtil.startNewGame,
        getHeight: function(){
            return gridState.height;
        },
        getWidth: function(){
            return gridState.width;
        },
        getMaskedTileValue: function(i,j){
            // return known tile values, mines are masked as UNKNOWN
            var v = TileUtil.getTileValue(i,j);
            return (v === gridState.MINE) ? gridState.UNKOWN : v;
        },
        isMineTile: TileUtil.isMineTile,
        expandTile: function(i,j){
            var idx = indexCalc.getIndex(i,j);

            if(grid[idx] === gridState.MINE){
                GameUtil.endGame(gridState.GAME_LOST);
            } else{
                TileUtil.recursiveExpandTile(idx);
            }
        },
        setXray: function(onOff){
            gridState.xray = onOff;
        },
        isXrayOn: function(){
            return gridState.xray || false;
        }
    };
    return svc;
}])
