var qiita = require('qiita'),
    model = module.exports;

var q = new qiita({
    team: process.env.QIITA_TEAM_ID,
    token: process.env.QIITA_ACCESS_TOKEN,
});

model.save = function(name, doc, template, cb){
    var data = {
        title: name,
        body: doc,
        tags: [{"name": template}],
    };
    q.items.post(data, function(err, res, body){
        if (err) {
            cb(true);
        } else {
            cb(err, res, body);
        }
    });
};
