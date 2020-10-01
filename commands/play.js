module.exports = {
	name: 'play',
    description: 'play a games',
    guildOnly: true,
    // NOTE: Executable command
	execute(message, args, gamefile) {
        // ANCHOR: if there are no other argument, it just setup the game model
        if(!args.length) {
            gamefile.gameSetup(); 
            this.show(message, gamefile);
        
        // ANCHOR: Otherwise, get the second argument and pass intent to model with it as the direction
        } else if(gamefile.gameState.length !== 0) {
            const direction = String(args[0]);
            gamefile.move(direction);
            this.show(message, gamefile);
        }
        
        // STUB: After any movement check whether the player has won
        if(gamefile.isWin) {
            message.channel.send('You win congrats, to restart call command `;play`');
            gamefile.gameState = [];
        }
    },
    // NOTE: Simple callable method to produce output
    show(message, gamefile) {
        let word = '';
        for(const row of gamefile.gameState) {
            for(const block of row) {
                word += block;
            }
            word += '\n';
        }
        message.channel.send(word);
    },
};