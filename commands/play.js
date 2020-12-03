module.exports = {
	name: 'play',
    description: 'play a games',
    guildOnly: true,
    games: {},
    // NOTE: Executable command
	execute(message, args, gamefile, Discord) {
        // ANCHOR: if there are no other argument, it just setup the game model
        if(!args.length) {

            // Create a hashmap describing the current channel message
            this.games[message.channel] = [];
            let newGame = new gamefile.PenguinGame();
            this.games[message.channel].push(newGame);

            // Show the game state and append the chat message id to the hashmap
            let newMessage = this.show(newGame, Discord);
            message.channel.send(newMessage).then( msg => {
                this.games[message.channel].push(msg);
                console.log(msg.id);
            });
        
        // ANCHOR: Otherwise, get the second argument and pass intent to model with it as the direction
        } else if(this.games[message.channel]) {
            const direction = String(args[0]);
            this.games[message.channel][0].move(direction);
            this.editGame(message, Discord);
        }

        if(!this.games[message.channel]) { 
            console.log('No game saved here yet')
            return; 
        }
        
        // STUB: After any movement check whether the player has won
        if(this.games[message.channel][0].isWin) {
            const winAlert = new Discord.MessageEmbed(this.show(this.games[message.channel][0], Discord))
            .setColor('#00ffff')
            .setTitle('You win congrats :partying_face:')
            .setFooter('restart call command `;play`');
            this.games[message.channel][1].edit(winAlert);
        }
    },
    // NOTE: Simple callable method to produce output
    show(game, Discord) {
        // Create the word string which is display string
        let word = '';
        // Loop through the gameState and fill in the word string
        for(const row of game.state) {
            for(const block of row) {
                word += block;
            }
            word += '\n';
        }

        let colors = ['#ffff00', '#ffa600', '#00ff88', '#ff0059'];
        let objective = ['Unlocks all the locks :lock: !!!', 'Feed the sad people :pensive: !!', 'Infect the asholes :unamused: !!', 'Cure the good sick people :sick: !!'];
        let chosen = colors[game.settingIndex];
    
        // Create an embed and return it
        return new Discord.MessageEmbed()
            .setColor(chosen)
            .setTitle(objective[game.settingIndex])
            .setDescription(word)
            .setFooter('To move, send W A S D in the current channel');
    },
    editGame(message, Discord) {
        const saveFile = this.games[message.channel];
        // Use the saved message, and edit it with a new embed
        saveFile[1].edit(this.show(saveFile[0], Discord))
        // Get the current channel and remove the movement message to remove cluter
        const currentChannel = message.channel;
        currentChannel.messages.delete(message).then(r => console.log(r));
    },
};
