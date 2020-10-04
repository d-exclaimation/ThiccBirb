const game = require("./gamefiles/game");

module.exports = {
	name: 'play',
    description: 'play a games',
    cooldown: 0.2,
    guildOnly: true,
    gameTheme: [null, null],
    gameMsg: null,
    // NOTE: Executable command
	execute(message, args, gamefile, Discord) {
        // ANCHOR: if there are no other argument, it just setup the game model
        if(!args.length) {
            gamefile.gameSetup(); 
            this.gameTheme = [null, null];
            let newMessage = this.show(gamefile, Discord);
            message.channel.send(newMessage).then( msg => {
                this.gameMsg = msg;
                console.log(msg.id);
            });
        
        // ANCHOR: Otherwise, get the second argument and pass intent to model with it as the direction
        } else if(gamefile.gameState.length !== 0) {
            if(message.channel !== this.gameMsg.channel) { return }
            const direction = String(args[0]);
            gamefile.move(direction.toLowerCase());
            this.editGame(message, gamefile, Discord);
        }

        
        // STUB: After any movement check whether the player has won
        if(gamefile.isWin) {
            const winAlert = new Discord.MessageEmbed(this.show(gamefile, Discord))
            .setColor('#00ffff')
            .setTitle('You win congrats :partying_face:')
            .setFooter('restart call command `;play`');
            this.gameMsg.edit(winAlert);
        }
    },
    // NOTE: Simple callable method to produce output
    show(gamefile, Discord) {
        // Create the word string which is display string
        let word = '';
        // Loop through the gameState and fill in the word string
        for(const row of gamefile.gameState) {
            for(const block of row) {
                word += block;
            }
            word += '\n';
        }

        // Get the appropriate game theme from the gamefile
        if(this.gameTheme[0] === null) {
            let objective = 'Unlock the keys';
            let themeColor = '#';
            switch(gamefile.index) {
                case 1:
                    objective = 'Feed the sad people';
                    themeColor += '00ffff';
                    break;
                case 2:
                    objective = 'Infect the healthy assholes';
                    themeColor += '00ff91';
                    break;
                case 3:
                    objective = 'Cure the infected people';
                    themeColor += 'ff00a6';
                    break;
                default:
                    objective = 'Unlock the locks using the keys';
                    themeColor += 'ffee00';
                    break;
            }
            this.gameTheme[0] = objective;
            this.gameTheme[1] = themeColor;
        }
        
        // Create an embed and return it
        const embed = new Discord.MessageEmbed()
        .setColor(this.gameTheme[1])
        .setTitle(this.gameTheme[0])
        .setDescription(word)
        .setFooter('To move, send W A S D in the current channel');
        return embed;
    },
    editGame(message, gamefile, Discord) {
        // Use the saved message, and edit it with a new embed
        this.gameMsg.edit(this.show(gamefile, Discord))
        // Get the current channel and remove the movement message to remove cluter
        const currentChannel = message.channel;
        currentChannel.messages.delete(message);
    },
};