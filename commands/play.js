module.exports = {
	name: 'play',
    description: 'play a games',
    guildOnly: true,
	execute(message, args, gamefile) {
        if(!args.length) {
            gamefile.gameSetup(); 
            this.show(message, gamefile);
        } else if(gamefile.gameState.length !== 0) {
            const direction = String(args[0]);
            gamefile.move(direction);
            this.show(message, gamefile);
        }
        if(gamefile.isWin) {
            message.channel.send('You win congrats, to restart call command `;play`');
            gamefile.gameState = [];
        }
    },
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