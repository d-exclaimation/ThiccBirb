// NOTE: Preps
// STUB: Import the discord.js module and file systems for node.js
const fs = require('fs');
const Discord = require('discord.js');


// STUB: Read from external JSON File
const { prefix, token } = require('./config.json');


// STUB: Create a new Discord client
const client = new Discord.Client();
client.commands = new Discord.Collection();
const cooldowns = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));


// STUB: Grab all the commands and make it into a collection using for loop
for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
}


// STUB: get game started
const gameArray = fs.readdirSync('./commands/gamefiles');
const game = require(`./commands/gamefiles/${gameArray[0]}`)


// STUB: when the client is ready, run this code
// this event will only trigger one time after logging in
client.once('ready', () => {
	console.log('Bot status is now online, check discord');
});

// NOTE: Messages output
client.on('message', async message => {

    // REVIEW: Check to see if the message is using the prefix and not from a bot
    const movementList = ['w', 'a', 's', 'd'];
    if (message.author.bot) return;
    let args = [];
    let commandName = '';
    

    // REVIEW: non prefix valid command checking
    let isMovement = false;

    // Loop through all the valid non prefix commands
    for(const word of movementList) {

        // If the argument is a valid command, break and set the value to true
        if(String(message.content).toLowerCase() === String(word)) {
            isMovement = true;
            break;
        }
    }
    // However is the game is not yet setup, then reset back to false
    if(!game.gameState) { isMovement = false; }


    // ANCHOR: Check whether the message given is a valid prefixed command, or a movement command, and not from a bot
    // If command is a movement command set the commandName to be play, and the second argument as the message content
    if(isMovement) {
        commandName = 'play';
        args[0] = String(message.content);

    // Otherwise. check whether it is include a prefix and not from a bot
    } else {
        if(!message.content.startsWith(prefix)) {
            return;
        }
        args = message.content.slice(prefix.length).trim().split(/ +/);
        commandName = args.shift().toLowerCase();
    }


    // ANCHOR: Dynamically find command according to the message and the command file name
    if (!client.commands.has(commandName)) return;
    const command = client.commands.get(commandName);
    
    if (command.guildOnly && message.channel.type === 'dm') {
        return message.reply('I can\'t execute that command inside DMs!');
    }


    // REVIEW: Check for cooldowns
    if (!cooldowns.has(command.name)) {
        cooldowns.set(command.name, new Discord.Collection());
    }
    // Get the current time and get 
    const now = Date.now();
    const timestamps = cooldowns.get(command.name);
    // Default timeout is 3 second
    const cooldownAmount = (command.cooldown || 0.25) * 1000;

    // if timestamps has a user in it meaning the user is in timeout
    if (timestamps.has(message.author.id)) {
        // Calculate the expired time 
        const expirationTime = timestamps.get(message.author.id) + cooldownAmount;
        
        // if current time is not yet larger than the expired estimate than reply notifying it
        if (now < expirationTime) {
            const timeLeft = (expirationTime - now) / 1000;
            return message.reply(`please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name}\` command.`);
        }
    }
    // if timestamps is empty, set the user to the timeout with it's appropriate cooldown
    timestamps.set(message.author.id, now);
    setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
    

    // REVIEW: if the command has an argurment as a requirement and the argument is not set
	if(command.args && !args.length) {
		return message.channel.send(`You didn't provide any arguments, ${message.author}!`); // Reply saying no arguments
    }
    

    // ANCHOR: Dynamically execute command according to the variable set before
    try {
        if(command.name === 'play') {
            command.execute(message, args, game, Discord);
        } else {
            command.execute(message, args, Discord);
        }
    } catch (error) {
        console.error(error);
        message.reply('there was an error trying to execute that command!');
    }

});


// STUB: login to Discord with your app's token
client.login(token);