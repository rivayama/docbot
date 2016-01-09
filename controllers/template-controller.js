var templateModel = require('../models/template-model');

module.exports.use = function(controller) {

    controller.hears(['create template (.*)'], 'direct_mention', function(bot, message){
        bot.startConversation(message, function(err, convo){
            var name = message.match[1];
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
                        controller.storage.channels.save(templateModel.data(name, list), function(err, id){
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

    controller.hears(['list template(s)?'], 'direct_mention', function(bot, message){
        controller.storage.channels.all(function(err, all_channel_data){
            if (all_channel_data) {
                var keys = Object.keys(all_channel_data).filter(templateModel.hasPrefix);
                bot.reply(message, keys.map(templateModel.removePrefix).join("\n"));
            }
        });
    });

    controller.hears(['show template (.*)'], 'direct_mention', function(bot, message){
        var name = message.match[1];
        controller.storage.channels.get(templateModel.addPrefix(name), function(err, template){
            if (template && template.format) {
                bot.reply(message, template.format);
            }
        });
    });

};
