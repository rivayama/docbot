var templateModel = require('../models/template-model');
var documentModel = require('../models/document-model');

module.exports.use = function(controller) {

    controller.hears(['create document (.*)'], 'direct_mention', function(bot, message){
        bot.startConversation(message, function(err, convo){
            var template = message.match[1];
            var title = '';
            var format = [];
            var doc = {};

            convo.on('end', function(convo){
                if (convo.status == 'stopped') {
                    bot.reply(message, 'No template ' + template);
                }
            });

            templateModel.get(template, controller, function(err, tpl){
                if (err) {
                    convo.stop();
                } else {
                    format = tpl.format.split("\n");
                }
            });

            convo.say('Ok, let\'s start to create ' + template + ' document');
            convo.ask('Title?', function(response, convo){
                title = response.text;
                convo.next();
            });
            for (key in format) {
                convo.ask(format[key] + '?', [
                    {
                        pattern: 'next',
                        callback: function(response, convo){
                            convo.next();
                        }
                    },
                    {
                        default: true,
                        callback: function(response, convo){
                            convo.silentRepeat();
                        }
                    },
                ]);
            }
            convo.say('Successfully created document ' + title);
        });
    });

};
