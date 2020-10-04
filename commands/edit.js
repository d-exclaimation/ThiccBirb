module.exports = {
	name: 'edit',
	description: 'custom',
	execute(message, args, Discord) {
        const currentChannel = message.channel;
        currentChannel.messages.delete(message);
        currentChannel.messages.fetch({ limit: 1 }).then(msgs => {
            for(let [key, value] of msgs) {
                savedtarget = String(key);
                value.edit(new Discord.MessageEmbed().setTitle(`${Math.random()}`));
            }
        });
    },
};