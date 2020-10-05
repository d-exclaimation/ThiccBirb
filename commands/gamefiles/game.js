class Roboton {
    state;
    playerCoordinate;
    targetsCoordinate;
    itemsCoordinate;
    gridSize = 15;
    settings = [[':lock:', ':key:', ':unlock:'], [':pensive:', ':meat_on_bone:', ':star_struck:'], [':unamused:', ':microbe:', ':sick:'], [':sick:', ':syringe:', ':smile:']];
    settingIndex;
    isWin;

    constructor() {
        // STUB: Reset all variables
        this.isWin = false;
        this.state = [];
        this.playerCoordinate = [];
        this.targetsCoordinate = [];
        this.itemsCoordinate = [];

        // Create game state and all things required for the game
        const numberOfObjective = Math.floor(Math.random() * 6) + 3;
        this.settingIndex = Math.floor(Math.random() * 4);
        for(let obj = 0; obj < numberOfObjective; obj++) {
            const target = [Math.floor(Math.random() * this.gridSize/3), Math.floor(Math.random() * this.gridSize)];
            let key = [Math.floor(Math.random() * (this.gridSize/3 - 1)) + 1, Math.floor(Math.random() * (this.gridSize - 1)) + 1];
            while((key[0] === target[0] && key[1] === target[1]) || (key[0] === this.gridSize/3 - 1 || key[1] === this.gridSize - 1) || Roboton.checkArray(key, this.targetsCoordinate)) {
                key = [Math.floor(Math.random() * (this.gridSize/3 - 1)) + 1, Math.floor(Math.random() * (this.gridSize - 1)) + 1];
            }
            this.targetsCoordinate.push(target);
            this.itemsCoordinate.push(key);
        }

        // Generate player
        let player = [Math.floor(Math.random() * this.gridSize/3), Math.floor(Math.random() * this.gridSize)];
        while(Roboton.checkArray(player, this.targetsCoordinate) || Roboton.checkArray(player, this.itemsCoordinate)) {
            player = [Math.floor(Math.random() * this.gridSize/3), Math.floor(Math.random() * this.gridSize)];
        }

        // STUB: Create game state grid
        for(let y = 0; y < this.gridSize/3; y++) {
            let currentRow = [];
            for(let x = 0; x < this.gridSize; x++) {
                const currentCoordinate = [y, x];
                if(y === player[0] && x === player[1]) {
                    currentRow.push(':penguin:');
                } else if(Roboton.checkArray(currentCoordinate, this.targetsCoordinate)) {
                    currentRow.push(this.settings[this.settingIndex][0]);
                } else if(Roboton.checkArray(currentCoordinate, this.itemsCoordinate)) {
                    currentRow.push(this.settings[this.settingIndex][1]);
                } else {
                    currentRow.push(':black_large_square:');
                }
            }
            this.state.push(currentRow);
        }
        this.playerCoordinate = player;

    }

    move(direction) {
        // Create a prediction
        let predictedCoordinate = [this.playerCoordinate[0], this.playerCoordinate[1]];

        switch(direction) {
            case 'w':
                predictedCoordinate[0] -= 1;
                break;
            case 's':
                predictedCoordinate[0] += 1;
                break;
            case 'a':
                predictedCoordinate[1] -= 1;
                break;
            case 'd':
                predictedCoordinate[1] += 1;
                break;
        }

        // Check for boundaries
        if(predictedCoordinate[0] > this.gridSize/3 - 1 || predictedCoordinate[0] < 0) {
            predictedCoordinate[0] = this.playerCoordinate[0];
        }
        if(predictedCoordinate[1] > this.gridSize - 1 || predictedCoordinate[1] < 0) {
            predictedCoordinate[1] = this.playerCoordinate[1];
        }

        if(Roboton.checkArray(predictedCoordinate, this.targetsCoordinate)) { predictedCoordinate = this.playerCoordinate; }

        // Moveable items
        if(this.state[predictedCoordinate[0]][predictedCoordinate[1]] === this.settings[this.settingIndex][1]) {
            // Predict item next movement
            let itemPrediction = [predictedCoordinate[0], predictedCoordinate[1]];

            // Make prediction
            switch(direction) {
                case 'w':
                    itemPrediction[0] -= 1;
                    break;
                case 's':
                    itemPrediction[0] += 1;
                    break;
                case 'a':
                    itemPrediction[1] -= 1;
                    break;
                case 'd':
                    itemPrediction[1] += 1;
                    break;
            }
            // REVIEW: If the future location is out of bound, reset it back, 
            if(itemPrediction[0] > this.gridSize/3 - 1 || itemPrediction[0] < 0) {
                itemPrediction[0] = predictedCoordinate[0];
                predictedCoordinate = this.playerCoordinate;
            }
            if(itemPrediction[1] > this.gridSize - 1 || itemPrediction[1] < 0) {
                itemPrediction[1] = predictedCoordinate[1];
                predictedCoordinate = this.playerCoordinate;
            }
            if(this.state[itemPrediction[0]][itemPrediction[1]] === this.settings[this.settingIndex][1]) {
                itemPrediction = [predictedCoordinate[0], predictedCoordinate[1]];
                predictedCoordinate = this.playerCoordinate;
            }


            // Create a new object
            let object = this.settings[this.settingIndex][1];
            // If the current moveable reaches a target than change the object to the finished object
            if(this.state[itemPrediction[0]][itemPrediction[1]] === this.settings[this.settingIndex][0]) { object = this.settings[this.settingIndex][2]; }
            else if(this.state[itemPrediction[0]][itemPrediction[1]] === this.settings[this.settingIndex][2]) { object = this.settings[this.settingIndex][2]; }
            // Change the next new location into the object
            this.state[itemPrediction[0]][itemPrediction[1]] = object;
            
            // TODO: Update the moveable coordinate, to be able to determine the end game
            for(let index = 0; index < this.itemsCoordinate.length; index++) {
                let coordinate = this.itemsCoordinate[index];
                if(coordinate[0] === predictedCoordinate[0] && coordinate[1] === predictedCoordinate[1]) {
                    this.itemsCoordinate[index] = itemPrediction;
                }
            }
        }
        // Switchero
        const tempItem = this.state[this.playerCoordinate[0]][this.playerCoordinate[1]];
        this.state[this.playerCoordinate[0]][this.playerCoordinate[1]] = ':black_large_square:';
        this.state[predictedCoordinate[0]][predictedCoordinate[1]] = tempItem; 

        this.playerCoordinate = predictedCoordinate;
        this.winningCheck();
    }

    winningCheck() {
        for(let i = 0; i < this.itemsCoordinate.length; i++) {
            if(!Roboton.checkArray(this.itemsCoordinate[i], this.targetsCoordinate)) {
                this.isWin = false;
                return;
            }
        }
        this.isWin = true;
    }

    static checkArray(array, grid) {
        if(!grid) { return false; }
        for(const item of grid) {
            if(array[0] === item[0] && array[1] === item[1]) {
                return true;
            }
        }
        return false;
    }
}


module.exports = { PenguinGame: Roboton };

let previousGame = {
    name: 'game',
    gameState: [],
    playerLocation: [],
    enemyLocation: [],
    boxLocation: [],
    gridCap: 15,
    themes: [[':lock:', ':key:', ':unlock:'], [':pensive:', ':meat_on_bone:', ':star_struck:'], [':smile:', ':microbe:', ':sick:'], [':sick:', ':syringe:', ':smile:']],
    index: 0,
    isWin: false,
    // NOTE: Game Initializers 
	gameSetup() {
        // STUB: Reset State
        this.isWin = false; // Reset the game win state
        this.gameState = [];
        this.index = 0;

        // ANCHOR: Randomize player and enemy
        const numberOfBlock = Math.floor(Math.random() * 6) + 3;
        const theme = Math.floor(Math.random() * 4);
        let enemy = [];
        let boxes = [];
        // Add the boxes and the holes
        for(let b = 0; b < numberOfBlock; b++) {
            const hole = [Math.floor(Math.random() * this.gridCap/3), Math.floor(Math.random() * this.gridCap)];
            let box = [Math.floor(Math.random() * (this.gridCap/3 - 1)) + 1, Math.floor(Math.random() * (this.gridCap - 1)) + 1];
            while((box[0] === hole[0] && box[1] === hole[1]) || (box[0] === this.gridCap/3 - 1 || box[1] === this.gridCap - 1) || this.checkIn(box, enemy)) {
                box = [Math.floor(Math.random() * (this.gridCap/3 - 1)) + 1, Math.floor(Math.random() * (this.gridCap - 1)) + 1];
            }
            enemy.push(hole);
            boxes.push(box);
        }
        
        // Generate player
        let player = [Math.floor(Math.random() * this.gridCap/3), Math.floor(Math.random() * this.gridCap)];
        while(this.checkIn(player, enemy) || this.checkIn(player, boxes)) {
            player = [Math.floor(Math.random() * this.gridCap/3), Math.floor(Math.random() * this.gridCap)];
        }

        // STUB: Fill in the grid
        for(let i = 0; i < this.gridCap/3; i++) {
            let row = [];
            for(let j = 0; j < this.gridCap; j++) {
                const coor = [i,j];
                if(i === player[0] && j === player[1]) {
                    row.push(':robot:');
                } else if(this.checkIn(coor, enemy)) {
                    row.push(this.themes[theme][0]);
                } else if(this.checkIn(coor, boxes)) {
                    row.push(this.themes[theme][1]);
                } else {
                    row.push(':black_large_square:');
                }
            }
            this.gameState.push(row);
        }

        // STUB: Update the stored player and enemy location
        this.playerLocation = player;
        this.enemyLocation = enemy;
        this.boxLocation = boxes;
        this.index = theme;
    },
    // NOTE: Movement logic
	move(direction) {

        // STUB: Create a new array for the possible next moves
        let newLocation = [this.playerLocation[0], this.playerLocation[1]];

        // ANCHOR: Check which direction is called
        switch(direction) {
            case 'w':
                newLocation[0] -= 1;
                break;
            case 's':
                newLocation[0] += 1;
                break;
            case 'a':
                newLocation[1] -= 1;
                break;
            case 'd':
                newLocation[1] += 1;
                break;
        }

        // REVIEW: If the future location is out of bound, reset it back, 
        if(newLocation[0] > this.gridCap/3 - 1 || newLocation[0] < 0) {
            newLocation[0] = this.playerLocation[0];
        }
        if(newLocation[1] > this.gridCap - 1 || newLocation[1] < 0) {
            newLocation[1] = this.playerLocation[1];
        }
        if(this.checkIn(newLocation, this.enemyLocation)) { newLocation = this.playerLocation; }


        // TODO: Moveable object
        if(this.gameState[newLocation[0]][newLocation[1]] === this.themes[this.index][1]) {
            let moveableCoordinate = [newLocation[0], newLocation[1]];
            switch(direction) {
                case 'w':
                    moveableCoordinate[0] -= 1;
                    break;
                case 's':
                    moveableCoordinate[0] += 1;
                    break;
                case 'a':
                    moveableCoordinate[1] -= 1;
                    break;
                case 'd':
                    moveableCoordinate[1] += 1;
                    break;
            }
            // REVIEW: If the future location is out of bound, reset it back, 
            if(moveableCoordinate[0] > this.gridCap/3 - 1 || moveableCoordinate[0] < 0) {
                moveableCoordinate[0] = newLocation[0];
                newLocation = this.playerLocation;
            }
            if(moveableCoordinate[1] > this.gridCap - 1 || moveableCoordinate[1] < 0) {
                moveableCoordinate[1] = newLocation[1];
                newLocation = this.playerLocation;
            }
            if(this.gameState[moveableCoordinate[0]][moveableCoordinate[1]] === this.themes[this.index][1]) {
                moveableCoordinate = newLocation;
                newLocation = this.playerLocation;
            }
            // Create a new object
            let object = this.themes[this.index][1];
            // If the current moveable reaches a target than change the object to the finished object
            if(this.gameState[moveableCoordinate[0]][moveableCoordinate[1]] === this.themes[this.index][0]) { object = this.themes[this.index][2]}
            // Change the next new location into the object
            this.gameState[moveableCoordinate[0]][moveableCoordinate[1]] = object;
            
            // TODO: Update the moveable coordinate, to be able to determine the end game
            for(let item = 0; item < this.boxLocation.length; item++) {
                let coordinate = this.boxLocation[item];
                if(coordinate[0] === newLocation[0] && coordinate[1] === newLocation[1]) {
                    this.boxLocation[item] = moveableCoordinate;
                }
            }
        }
        

        // ANCHOR: Move player
        const temp = this.gameState[this.playerLocation[0]][this.playerLocation[1]];
        this.gameState[this.playerLocation[0]][this.playerLocation[1]] = ':black_large_square:';
        this.gameState[newLocation[0]][newLocation[1]] = temp;

        // Set new location
        this.playerLocation = newLocation;
        this.checkWin();
    },
    checkIn(array, grid) {
        // Given a normal array and a grid, check if the grid contains that array
        for(let i = 0; i < grid.length; i++) {
            let loop = grid[i];
            if(loop[0] === array[0] && loop[1] === array[1]){
                return true;
            }
        }
        return false;
    },
    checkWin() {
        // Check for the enemy locations and box locations 
        for(let i = 0; i < this.boxLocation.length; i++) {
            if(!this.checkIn(this.boxLocation[i], this.enemyLocation)) {
                this.isWin = false;
                return;
            }
        }
        this.isWin = true;
    },
}