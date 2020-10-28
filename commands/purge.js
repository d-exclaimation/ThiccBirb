module.exports = {
	name: 'purge',
    description: 'purging messages',
    guildOnly: true,
	execute(message, args, Discord) {
        let amount = 0
        if(args[0] == "all") {
            amount = 99
        } else {
            amount = parseInt(args[0]) + 1;
        }
		if(isNaN(amount)) {
            return message.reply('You big gay, learn to count numbers');
        } else if(amount <= 1 || amount > 100) {
            return message.reply('The amount is either under or over the limit range, 1 - 99');
        }
        message.channel.bulkDelete(amount, true).catch( err => {
            console.error(err);
            message.channel.send('there was an error trying to prune messages in this channel!');
        });
    },
};