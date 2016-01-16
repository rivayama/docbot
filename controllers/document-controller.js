var templateModel = require('../models/template-model');
var documentModel = require('../models/document-model');
var qiitaModel    = require('../models/qiita-model');
var mdHelper      = require('../helpers/markdown-helper');

module.exports.use = function(controller) {

    controller.hears(['create document (.*)'], 'direct_mention', function(bot, message){
        bot.startConversation(message, function(err, convo){
            var template = message.match[1];
            var format = [];
            var title = '';
            var item = '';
            var list = [];
            convo.on('end', function(convo){
                if (convo.status == 'stopped') {
                    bot.reply(message, 'No template ' + template);
                }
                if (convo.status == 'completed') {
                    var doc = '';
                    for (key in format) {
                        doc += mdHelper.h1(format[key]);
                        doc += list[key];
                        doc += mdHelper.changeTopic();
                    }
                    documentModel.save(title, doc, controller, function(err, id){
                        if (err) return;
                        qiitaModel.save(title, doc, template, function(err, res, body){
                            if (err) return;
                            bot.reply(message, 'Successfully created document ' + title);
                        });
                    });
                }
            });
            templateModel.get(template, controller, function(err, tpl){
                if (err) {
                    convo.stop(); // Go to convo.on('end', ...) with 'stopped' status
                } else {
                    format = tpl.format.split("\n");
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
                                    if (item !== '') {
                                        list.push(item);
                                        item = '';
                                    }
                                    convo.next();
                                }
                            },
                            {
                                default: true,
                                callback: function(response, convo){
                                    item += response.text;
                                    item += mdHelper.lineBreak();
                                    convo.silentRepeat();
                                }
                            },
                        ]);
                        // Go to convo.on('end', ...) with 'completed' status
                    }
                }
            });
        });
    });

    controller.hears(['list document(s)?'], 'direct_mention', function(bot, message){
        documentModel.all(controller, function(err, documents){
            if (!err) {
                bot.reply(message, documents.join("\n"));
            }
        });
    });

    controller.hears(['show document (.*)'], 'direct_mention', function(bot, message){
        var name = message.match[1];
        documentModel.get(name, controller, function(err, doc){
            if (!err) {
                bot.reply(message, doc.text);
            }
        });
    });

};
