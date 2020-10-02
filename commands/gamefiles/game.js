module.exports = {
    name: 'game',
    gameState: [],
    playerLocation: [],
    enemyLocation: [],
    gridCap: 15,
    isWin: false,
    // NOTE: Game Initializers 
	gameSetup() {
        // STUB: Reset State
        this.isWin = false; // Reset the game win state

        // ANCHOR: Randomize player and enemy
        const player = [Math.floor(Math.random() * this.gridCap/3), Math.floor(Math.random() * this.gridCap)];
        let enemy = [Math.floor(Math.random() * this.gridCap/3), Math.floor(Math.random() * (this.gridCap - 10) + 10)];
        if(enemy === player) {
            enemy = [Math.floor(Math.random() * this.gridCap/3), Math.floor(Math.random() * (this.gridCap - 10) + 10)];
        }

        // STUB: Fill in the grid
        for(let i = 0; i < this.gridCap/3; i++) {
            let row = [];
            for(let j = 0; j < this.gridCap; j++) {
                if(i === player[0] && j === player[1]) {
                    row.push(':scream:');
                } else if(i === enemy[0] && j === enemy[1]) {
                    row.push(':bread:')
                }else {
                    row.push(':black_large_square:');
                }
            }
            this.gameState.push(row);
        }

        // STUB: Update the stored player and enemy location
        this.playerLocation = player;
        this.enemyLocation = enemy;
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

        // TODO: If the future location is out of bound, reset it back, this is where is a moveable object logic would be placed (New Feature).
        if(newLocation[0] > this.gridCap/3 - 1 || newLocation[0] < 0) {
            newLocation[0] = this.playerLocation[0];
        }
        if(newLocation[1] > this.gridCap - 1 || newLocation[1] < 0) {
            newLocation[1] = this.playerLocation[1];
        }

        // ANCHOR: Move player
        const temp = this.gameState[this.playerLocation[0]][this.playerLocation[1]];
        this.gameState[this.playerLocation[0]][this.playerLocation[1]] = ':black_large_square:';
        this.gameState[newLocation[0]][newLocation[1]] = temp;

        // Set new location
        this.playerLocation = newLocation;

        // REVIEW: Check whether the player has reached the bread
        if(this.playerLocation[0] === this.enemyLocation[0] && this.playerLocation[1] === this.enemyLocation[1]) {
            console.log('The goal is reached');
            this.isWin = true;
        }
    },
};