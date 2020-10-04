module.exports = {
	name: 'ping',
	cooldown: 5,
	description: 'Ping!',
	execute(message, args, Discord) {
		message.channel.send('Pong.');
	},
};