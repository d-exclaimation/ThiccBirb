module.exports = {
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

            let object = this.themes[this.index][1];
            if(this.gameState[moveableCoordinate[0]][moveableCoordinate[1]] === this.themes[this.index][0]) { object = this.themes[this.index][2]}
            this.gameState[moveableCoordinate[0]][moveableCoordinate[1]] = object;
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
        for(let i = 0; i < grid.length; i++) {
            let loop = grid[i];
            if(loop[0] === array[0] && loop[1] === array[1]){
                return true;
            }
        }
        return false;
    },
    checkWin() {
        for(let i = 0; i < this.boxLocation.length; i++) {
            if(!this.checkIn(this.boxLocation[i], this.enemyLocation)) {
                this.isWin = false;
                return;
            }
        }
        this.isWin = true;
    },
};