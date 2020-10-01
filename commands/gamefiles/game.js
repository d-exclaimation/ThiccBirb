module.exports = {
    name: 'game',
    gameState: [],
    playerLocation: [],
    enemyLocation: [],
    gridCap: 15,
    isWin: false,
	gameSetup() {
        this.isWin = false;
        const player = [Math.floor(Math.random() * this.gridCap/3), Math.floor(Math.random() * this.gridCap)];
        let enemy = [Math.floor(Math.random() * this.gridCap/3), Math.floor(Math.random() * (this.gridCap - 10) + 10)];
        if(enemy === player) {
            enemy = [Math.floor(Math.random() * this.gridCap/3), Math.floor(Math.random() * (this.gridCap - 10) + 10)];
        }
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
        this.playerLocation = player;
        console.log(`Player starts at ${this.playerLocation}`);
        this.enemyLocation = enemy;
        console.log(`Enemy is at ${this.enemyLocation}`);
    },
	move(direction) {
        let newLocation = [this.playerLocation[0], this.playerLocation[1]];
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

        if(newLocation[0] > this.gridCap/3 - 1 || newLocation[0] < 0) {
            newLocation[0] = this.playerLocation[0];
        }
        if(newLocation[1] > this.gridCap - 1 || newLocation[1] < 0) {
            newLocation[1] = this.playerLocation[1];
        }

        const temp = this.gameState[this.playerLocation[0]][this.playerLocation[1]];
        this.gameState[this.playerLocation[0]][this.playerLocation[1]] = ':black_large_square:';
        this.gameState[newLocation[0]][newLocation[1]] = temp;

        this.playerLocation = newLocation;
        console.log(`Player is now at ${this.playerLocation}`);
        console.log(`Enemy is at ${this.enemyLocation}`);
        if(this.playerLocation[0] === this.enemyLocation[0] && this.playerLocation[1] === this.enemyLocation[1]) {
            console.log('The goal is reached');
            this.isWin = true;
        }
    },
};