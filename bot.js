const Discord = require('discord.io');
const logger = require('winston');
const auth = require('./auth.json');

// Configure logger settings
logger.remove(logger.transports.Console);
logger.add(new logger.transports.Console, {
    colorize: true
});

logger.level = 'debug';

// Initialize Discord Bot
const bot = new Discord.Client({
    token: auth.token,
    autorun: true
});

bot.on('ready', function (evt) {
    logger.info('Connected');
    logger.info('Logged in as: ');
    logger.info(bot.username + ' - (' + bot.id + ')');
});

bot.on('message', function (user, userID, channelID, message, evt) {
    // Our bot needs to know if it will execute a command
    // It will listen for messages that will start with `!`
    if (message.substring(0, 1) === '!') {
        var args = message.substring(1).split(' ');
        var cmd = args[0];
        const instructions = 'type !roll #d#+# (example: !roll 5d20+2)';

        args = args.splice(1);

        if (message.includes('roll') && message.includes('d')) {
            let modifier = 0;
            let strOut = message;

            if (message.includes('+')) {
                let modString = message.split('+'); //separate the modifier
                strOut = modString[0];
                modifier = modString[1];
                // strOut = message.splice(0,message.length).split('+');
            }

            const dieRoll = strOut.substring(6, message.length).split('d'); //separate ex: 15 d 20
            const dice = dieRoll[0]; //how many dice
            const dieSize = dieRoll[1]; //how many sides per die

            roll(dice, dieSize, modifier);

        } else if(message.includes('roll') && !message.includes('d')){
            bot.sendMessage({
                to:channelID,
                message: instructions
            });
        }

        function roll(dice, max, bonus) {
            let output = user + ' -- ';
            let addBonus = '';
            if (bonus > 0) {
                addBonus = ' (+' + bonus + ')';
            }

            //don't allow unlimited dice rolling
            if(dice > 20){
                output = 'too many dice (more than 20)';
            } else {
                for(let i = 1; i <= dice; i++){
                    let diceRoll = Math.floor(Math.random() * (max - 1 + 1)) + 1;
                    if (i === 1){
                        output += diceRoll + addBonus;
                    } else {
                        output += '      ' + diceRoll + addBonus;
                    }
                }
            }
            bot.sendMessage({
                to: channelID,
                message: output
            });
        }
     }
});