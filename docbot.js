if (!process.env.SLACK_API_TOKEN) {
    console.log('Error: Specify token in environment');
    process.exit(1);
}

var Botkit = require('botkit');
var os = require('os');
var controller = Botkit.slackbot({
    debug: true,
});
var bot = controller.spawn({
    token: process.env.SLACK_API_TOKEN
}).startRTM();

var help = require('./controllers/help-controller');
var template = require('./controllers/template-controller');
var document = require('./controllers/document-controller');

help.use(controller);
template.use(controller);
document.use(controller);

