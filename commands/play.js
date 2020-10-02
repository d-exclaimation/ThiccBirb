module.exports = {
	name: 'play',
    description: 'play a games',
    guildOnly: true,
    // NOTE: Executable command
	execute(message, args, gamefile, Discord) {
        // ANCHOR: if there are no other argument, it just setup the game model
        if(!args.length) {
            gamefile.gameSetup(); 
            this.show(message, gamefile, Discord);
        
        // ANCHOR: Otherwise, get the second argument and pass intent to model with it as the direction
        } else if(gamefile.gameState.length !== 0) {
            const direction = String(args[0]);
            gamefile.move(direction.toLowerCase());
            this.show(message, gamefile, Discord);
        }
        
        // STUB: After any movement check whether the player has won
        if(gamefile.isWin) {
            const winAlert = new Discord.MessageEmbed()
            .setColor('#00ffff')
            .setDescription('You win congrats, to restart call command `;play`');
            message.channel.send(winAlert);
            gamefile.gameState = [];
        }
    },
    // NOTE: Simple callable method to produce output
    show(message, gamefile, Discord) {
        let word = '';
        for(const row of gamefile.gameState) {
            for(const block of row) {
                word += block;
            }
            word += '\n';
        }
        const embed = new Discord.MessageEmbed()
        .setColor('#00ffff')
        .setTitle('Get the bread')
        .setDescription(word)
        .setFooter('To move, send W A S D in the current channel');
        message.channel.send(embed);
    },
};