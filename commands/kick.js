module.exports = {
	name: 'kick',
    description: 'kick player',
    guildOnly: true,
    // NOTE: Kick Users Executable
	execute(message, args) {
        // Check whether there are users mentioned and not over the limit of one
		if(!message.mentions.users.size || message.mentions.users.size > 1) {
            return message.reply('No users is mentioned or over mentioned users');
        } else {
            // STUB: Check whether the author of the command has permission to kick members
            if (!message.guild.member(message.author).hasPermission('KICK_MEMBERS')) { return message.channel.send('You do not have the permission for kick users"  !'); }
            // Set the targeted users as its own variable
            let banMember = message.guild.member(message.mentions.users.first());
            // Check whether the variable actually exist in any edge cases
            if(!banMember) {
                return message.reply('User not found');
            
            // If all has passed. Execute command kick onto the banned member
            } else {
                try {
                    // Kick member than reply with the appropriate messages
                    banMember.kick().then( member => {
                        message.channel.send(":wave: " + member.displayName + " has been successfully kicked :point_right: ");
                        message.channel.send("https://media.tenor.com/images/aa9aecc8008b3f49eb12f75e0d47e82e/tenor.gif");
                    })
                } catch(err) {
                    console.log(err);
                    return message.reply('It looks like something is off, it might that I don`t have the permission to do so');
                }
            }
        }
    },
};