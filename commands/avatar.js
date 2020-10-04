module.exports = {
	name: 'avatar',
	description: 'avatar',
	execute(message, args, Discord) {
		if(!message.mentions.users.size) {
            message.channel.send('Your avatar is '+ String(message.author.displayAvatarURL({ format: "png", dynamic: true })));
        } else {
            const allImages = message.mentions.users.map( user => {
                return user.displayAvatarURL({ format: "png", dynamic: true });
            });
            message.channel.send(allImages);
        }
    },
};