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

// NOTE: Grab all the commands and make it into a collection using for loop
for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
}


// NOTE: when the client is ready, run this code
// this event will only trigger one time after logging in
client.once('ready', () => {
	console.log('Ready!, Bot is now online');
});

// Listening for messages
// TODO: Get better system on getting user input command instead of keep on listening for random words
client.on('message', message => {

    // REVIEW: Check to see if the message is using the prefix and not from a bot
    if (!message.content.startsWith(prefix)|| message.author.bot ) return;
    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    // REVIEW: Dynamically find command according to the message and the command file name
    if (!client.commands.has(commandName)) return;
    const command = client.commands.get(commandName);


    // REVIEW: Check for cooldowns
    if (!cooldowns.has(command.name)) {
        cooldowns.set(command.name, new Discord.Collection());
    }
    // Get the current time and get 
    const now = Date.now();
    const timestamps = cooldowns.get(command.name);
    // Default timeout is 3 second
    const cooldownAmount = (command.cooldown || 1) * 1000;

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
    
    // STUB: Dynamically execute command according to the variable set before
    try {
        command.execute(message, args);
    } catch (error) {
        console.error(error);
        message.reply('there was an error trying to execute that command!');
    }

});


// STUB: login to Discord with your app's token
client.login(token);