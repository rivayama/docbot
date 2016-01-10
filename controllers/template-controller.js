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
                        templateModel.save(name, list, controller, function(err, id){
                            if (!err) {
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
        templateModel.all(controller, function(err, templates){
            if (!err) {
                bot.reply(message, templates.join("\n"));
            }
        });
    });

    controller.hears(['show template (.*)'], 'direct_mention', function(bot, message){
        var name = message.match[1];
        templateModel.get(name, controller, function(err, tpl){
            if (!err) {
                bot.reply(message, tpl.format);
            }
        });
    });

};
