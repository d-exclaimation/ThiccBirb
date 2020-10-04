module.exports = {
	name: 'info',
	description: 'Bot info',
	execute(message, args, Discord) {
        const embed = new Discord.MessageEmbed()
        .setColor('#bffc05')
        .setAuthor('Thicc Birb', 'https://i.ibb.co/52KtH3K/43ie06cz-400x400.jpg', 'http://jelasbukangoogle.com')
        .setThumbnail('https://i.ibb.co/52KtH3K/43ie06cz-400x400.jpg')
        .setTitle('*Thicc Birb Info*')
        .setDescription('This bot is made by Vincent, for the purpose which he has yet to set.\nHowever, at the moment, the bot can do some stuff, which are:')
        .addFields(
            { name: 'play', value: 'Basically allow you to play a simple game' },
            { name: 'kick', value: 'Kick users', inline: true },
            { name: 'ban', value: 'I dont need to explain this one, move along', inline: true },
            { name: 'ping', value: 'To either check if the bot responses or to act like you have friends', inline: true },
            { name: 'beep', value: 'Just like ping but less lonely', inline: true },
            { name: 'purge', value: 'Clear a certain amount of messages at the range from 1 - 99', inline: true },
            { name: 'avatar', value: 'Get your avatar or someone else`s which you have to mentioned', inline: true },
        )
        .setFooter('Copyright © 2020 Vincent. All rights reserved.');
        message.channel.send(embed);
    },
};