class Roboton {
    state; // Game State / Grid
    playerCoordinate; // Saved player coordinate
    targetsCoordinate; // Saved targets coordinates array
    itemsCoordinate; // Saved items coordinates array
    grid = {
        width: 15,
        height: 5,
    }; // Initial grid size
    settings = [
        [':lock:', ':key:', ':unlock:'], 
        [':pensive:', ':meat_on_bone:', ':star_struck:'], 
        [':unamused:', ':microbe:', ':sick:'], 
        [':sick:', ':syringe:', ':smile:']
    ]; // Themes
    settingIndex; // Theme selected
    isWin; // Is Win Method

    constructor() {

        // STUB: Reset all variables
        this.isWin = false;
        this.state = [];
        this.playerCoordinate = [];
        this.targetsCoordinate = [];
        this.itemsCoordinate = [];

        // Create game state and all things required for the game
        const numberOfObjective = Roboton.uniform(6) + 3;
        this.settingIndex = Roboton.uniform(4);

        // Create Objects
        for(let obj = 0; obj < numberOfObjective; obj++) {

            // Initial objects
            const target = [Roboton.uniform(this.grid.height), Roboton.uniform(this.grid.width)];
            let key = [Roboton.uniform((this.grid.height - 1), 1), Roboton.uniform((this.grid.width - 1), 1)];

            // Check if overlap happened
            const onEdges = (key[0] === this.grid.height - 1 || key[1] === this.grid.width - 1); // with edges
            const onSelf = (key[0] === target[0] && key[1] === target[1]); // with others
            while( onSelf || onEdges || Roboton.checkArray(key, this.targetsCoordinate)) {
                key = [Roboton.uniform((this.grid.height - 1), 1), Roboton.uniform((this.grid.width - 1), 1)];
            }

            // Set new targets coordinate and key
            this.targetsCoordinate.push(target);
            this.itemsCoordinate.push(key);
        }

        // Generate player
        let player = [Math.floor(Math.random() * this.grid.height), Math.floor(Math.random() * this.grid.width)];
        while(Roboton.checkArray(player, this.targetsCoordinate) || Roboton.checkArray(player, this.itemsCoordinate)) {
            player = [Math.floor(Math.random() * this.grid.height), Math.floor(Math.random() * this.grid.width)];
        }

        // STUB: Create game state grid
        for(let y = 0; y < this.grid.height; y++) {
            let currentRow = [];
            for(let x = 0; x < this.grid.width; x++) {
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
        if(predictedCoordinate[0] > this.grid.height - 1 || predictedCoordinate[0] < 0) {
            return;
        }
        if(predictedCoordinate[1] > this.grid.width - 1 || predictedCoordinate[1] < 0) {
            return;
        }

        // Check for targets so player doesn't crash into one
        if(Roboton.checkArray(predictedCoordinate, this.targetsCoordinate)) { return; }

        // Moveable items, recursive. If it able to be moved, move it then say that it moved so we can continue, otherwise, stop the process
        if(this.state[predictedCoordinate[0]][predictedCoordinate[1]] === this.settings[this.settingIndex][1]) {
            let isMove = this.moveObject(predictedCoordinate, direction)
            if (!isMove) { return; }
        }

        // Switchero
        const tempItem = this.state[this.playerCoordinate[0]][this.playerCoordinate[1]];
        this.state[this.playerCoordinate[0]][this.playerCoordinate[1]] = ':black_large_square:';
        this.state[predictedCoordinate[0]][predictedCoordinate[1]] = tempItem; 

        // Update player coordinate and check if the game has been won
        this.playerCoordinate[0] = predictedCoordinate[0];
        this.playerCoordinate[1] = predictedCoordinate[1];
        this.winningCheck();
    }

    moveObject(location, direction) {

        // Predict item next movement
        let itemPrediction = [location[0], location[1]];

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
            return false;
        }
        if(itemPrediction[1] > this.gridSize - 1 || itemPrediction[1] < 0) {
            return false
        }

        // REVIEW: If future location is a finished target just stop the process
        if(this.state[itemPrediction[0]][itemPrediction[1]] === this.settings[this.settingIndex][2]) {
            return false; 
        }

        // NOTE: If the future location is another item, recursively move that first, otherwise invalidate movement
        if(this.state[itemPrediction[0]][itemPrediction[1]] === this.settings[this.settingIndex][1]) {
            let isMove = this.moveObject(itemPrediction, direction)
            if(!isMove) { return false; }
        }

        // Create a new object
        let object = this.settings[this.settingIndex][1];

        // If the current moveable reaches a target than change the object to the finished object
        if(this.state[itemPrediction[0]][itemPrediction[1]] === this.settings[this.settingIndex][0]) { object = this.settings[this.settingIndex][2]; }

        // Change the next new location into the object
        this.state[itemPrediction[0]][itemPrediction[1]] = object;
        this.state[location[0]][location[1]] = ':black_large_square:';

        // TODO: Update the moveable coordinate, to be able to determine the end game
        for(let index = 0; index < this.itemsCoordinate.length; index++) {
            let coordinate = this.itemsCoordinate[index];
            if(coordinate[0] === location[0] && coordinate[1] === location[1]) {
                this.itemsCoordinate[index][0] = itemPrediction[0];
                this.itemsCoordinate[index][1] = itemPrediction[1];
            }
        }

        // Notify the caller that a movement happened meaning it is safe to move for them
        return true; 
    }

    winningCheck() {

        // Loop through items array see if any is left
        for(let i = 0; i < this.itemsCoordinate.length; i++) {
            if(!Roboton.checkArray(this.itemsCoordinate[i], this.targetsCoordinate)) {
                this.isWin = false;
                return;
            }
        }
        this.isWin = true;
    }

    static checkArray(array, grid) {

        // My own function to check is the contents of array is similar
        if(!grid) { return false; }
        for(const item of grid) {
            if(array[0] === item[0] && array[1] === item[1]) {
                return true;
            }
        }
        return false;
    }

    static uniform(start, end = 0) {
        // Randomize uniform from start to end
        return Math.floor(Math.random() * (start - end) + end)
    }

}



module.exports = { PenguinGame: Roboton };