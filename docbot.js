if (!process.env.token) {
    console.log('Error: Specify token in environment');
    process.exit(1);
}

var Botkit = require('botkit');
var os = require('os');
var controller = Botkit.slackbot({
    debug: true,
});
var bot = controller.spawn({
    token: process.env.token
}).startRTM();

var template_prefix = '@template_';


controller.hears(['create template (.*)'], 'direct_message,direct_mention,mention', function(bot, message){
    bot.startConversation(message, function(err, convo){
        var matches = message.text.match(/create template (.*)/i);
        var name = matches[1];
        var item = '';
        var list = [];
        convo.say('Ok, let\'s start to create template ' + name);
        convo.ask('Item?', [
            {
                pattern: 'next',
                callback: function(response, convo){
                    if (item !== '') {
                        list.push(item);
                        item = '';
                    }
                    convo.repeat();
                    convo.next();
                }
            },
            {
                pattern: 'end',
                callback: function(response, convo){
                    if (item !== '') {
                        list.push(item);
                        item = '';
                    }
                    controller.storage.channels.save(templateData(name, list), function(err, id){
                        if (err) {
                            convo.say('Failed to create template ' + name);
                            convo.stop();
                        } else {
                            convo.say('Successfully created template ' + name);
                            convo.next();
                        }
                    });
                }
            },
            {
                default: true,
                callback: function(response, convo){
                    item += response.text;
                    convo.silentRepeat();
                }
            },
        ]);
    });
});

controller.hears(['list (.*)'], 'direct_message,direct_mention,mention', function(bot, message){
    var matches = message.text.match(/list (.*)/i);
    var target = matches[1];
    switch (target) {
        case 'template':
        case 'templates':
            controller.storage.channels.all(function(err, all_channel_data){
                if (all_channel_data) {
                    var keys = Object.keys(all_channel_data).filter(hasTemplatePrefix);
                    bot.reply(message, keys.map(removeTemplatePrefix).join("\n"));
                }
            });
            break;
        default:
            break;
    }
});

controller.hears(['show (.*) (.*)'], 'direct_message,direct_mention,mention', function(bot, message){
    var matches = message.text.match(/show (.*) (.*)/i);
    var target = matches[1];
    var name = matches[2];
    switch (target) {
        case 'template':
            controller.storage.channels.get(addTemplatePrefix(name), function(err, template){
                if (template && template.format) {
                    bot.reply(message, template.format);
                }
            });
            break;
        default:
            break;
    }
});

templateData = function(name, list){
    return {
        id: addTemplatePrefix(name),
        format: list.join("\n"),
    };
}
hasTemplatePrefix = function(key){
    var regex = new RegExp('^' + template_prefix);
    return key.match(regex);
}
removeTemplatePrefix = function(name){
    return name.replace(template_prefix, '');
}
addTemplatePrefix = function(name){
    return template_prefix + name;
}

