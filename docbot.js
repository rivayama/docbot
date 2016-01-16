if (!process.env.SLACK_API_TOKEN) {
    console.log('Error: Specify token in environment');
    process.exit(1);
}

var Botkit = require('botkit');
var mongo_storage = require('./node_modules/botkit/lib/storage/mongo_storage.js')({
  mongo_uri: "mongodb://docbot:docbot@localhost:27017/docbot"
});
var os = require('os');
var controller = Botkit.slackbot({
    debug: true,
    storage: mongo_storage
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

