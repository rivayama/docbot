var templateModel = require('../models/template-model');
var documentModel = require('../models/document-model');
var mdHelper      = require('../helpers/markdown-helper');

module.exports.use = function(controller) {

    controller.hears(['create document (.*)'], 'direct_mention', function(bot, message){
        bot.startConversation(message, function(err, convo){
            var template = message.match[1];
            var format = [];
            var title = '';
            var doc = '';
            var item = '';

            convo.on('end', function(convo){
                if (convo.status == 'stopped') {
                    bot.reply(message, 'No template ' + template);
                }
            });

            templateModel.get(template, controller, function(err, tpl){
                if (err) {
                    convo.stop(); // Go to convo.on('end', ...) with 'stopped' status
                } else {
                    format = tpl.format.split("\n");
                }
            });

            convo.say('Ok, let\'s start to create ' + template + ' document');
            convo.ask('Title?', function(response, convo){
                title = response.text;
                doc += mdHelper.h1(title);
                doc += mdHelper.changeTopic();
                convo.next();
            });

            console.log(doc);

            for (key in format) {
                convo.ask(format[key] + '?', [
                    {
                        pattern: 'next',
                        callback: function(response, convo){
                            doc += mdHelper.h2(format[key]);
                            doc += item;
                            doc += mdHelper.changeTopic();
                            item = '';
                            convo.next();
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
            }
            convo.say('Successfully created document ' + title);
            convo.say(doc);
        });
    });

};
