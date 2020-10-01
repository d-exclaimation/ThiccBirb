// STUB: Import the discord.js module
const Discord = require('discord.js');

// STUB: Read from external JSON File
const { prefix, token } = require('./config.json');

// STUB: Create a new Discord client
const client = new Discord.Client();

// NOTE: when the client is ready, run this code
// this event will only trigger one time after logging in
client.once('ready', () => {
	console.log('Ready!, Bot is now online');
});

// Listening for messages
// TODO: Get better system on getting user input command instead of keep on listening for random words
client.on('message', message => {

    // REVIEW: Check to see if the message is using the prefix and not from a bot
    if ((!message.content.startsWith(prefix) && previousCommand === '') || message.author.bot ) return;

    if(previousCommand === '') {
        const args = message.content.slice(prefix.length).trim().split(/ +/);
        const command = args.shift().toLowerCase();
        const targetedUser = message.mentions.users.first();
        const amount = parseInt(args[0]) + 1;

        switch(command) {
            case 'ping':
                sendMessage('Pong!!', message);
                break;
            case 'beep':
                sendMessage('Your mom fat, I am not saying boop. You loser!!', message);
                break;
            case 'kick':
                if(targetedUser) {
                    previousCommand = command;
                    sendMessage('Are you sure about kicking ' + String(targetedUser) + ' ?', message);
                } else {
                    return message.reply('You forgot to mention anyone dummydumb!');
                }
                break;
            case 'avatar':
                if(!message.mentions.users.size) {
                    sendMessage('Your avatar is '+ String(message.author.displayAvatarURL({ format: "png", dynamic: true })), message);
                } else {
                    const allImages = message.mentions.users.map( user => {
                        return user.displayAvatarURL({ format: "png", dynamic: true });
                    });
                    sendMessage(allImages, message);
                }
                break;
            case 'purge':
                if(isNaN(amount)) {
                    return message.reply('You big gay, learn to count numbers');
                } else if(amount <= 1 || amount > 100) {
                    return message.reply('The amount is either under or over the limit range, 1 - 99');
                } else {
                    message.channel.bulkDelete(amount, true).catch( err => {
                        console.error(err);
                        message.channel.send('there was an error trying to prune messages in this channel!');
                    });
                }
        }
    } else {
        switch(previousCommand) {
            case 'kick':
                if(message.content.toLowerCase() === 'yes') {
                    previousCommand = '';
                    return message.reply('Your wish is my command');
                } else {
                    previousCommand = '';
                    sendMessage('ok', message);
                }
                break;
        }
    }

});

// TODO: You probably create a class object instance for storing variables
let previousCommand = '';

// ANCHOR: Functions
function sendMessage(word, message) {
    message.channel.send(word);
}

// STUB: login to Discord with your app's token
client.login(token);