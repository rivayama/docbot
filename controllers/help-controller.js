var md = require('../helpers/markdown-helper');

module.exports.use = function(controller) {

    controller.hears(['help'], 'direct_mention', function(bot, message){
        var botName = '@' + bot.identity.name
        var help = ''
            + md.italic('Preparing template:') + '\n'
            + md.command(botName + ': create template _template name_') + ' Start to create template \n'
            + md.indent() + 'Input template headings and send following command: \n'
            + md.indent() + md.command('next') + ' to input another heading \n'
            + md.indent() + md.command('end') + ' to finish creating template \n'
            + '\n'
            + md.command(botName + ': list templates') + ' Show all templates \n'
            + md.command(botName + ': show template _template name_') + ' Show all headings in the template \n'
            + '\n'
            + md.italic('Writing document:') + '\n'
            + md.command(botName + ': create document _template name_') + ' Start to create document by given template \n'
            + md.indent() + 'Input title and text for each headings, and send following command:\n'
            + md.indent() + md.command('next') + ' to input text for next heading \n'
            + md.indent() + 'Once texts for all headings are given, bot posts the document to your Qiita: Team. \n'
            + '\n'
            + md.command(botName + ': list documents') + ' Show all documents \n'
            + md.command(botName + ': show document _document title_') + ' Show the document \n'
        ;
        bot.reply(message, help);
    });

};
