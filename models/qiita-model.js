var qiita = require('qiita'),
    model = module.exports;

var q = new qiita({
    team: 'Your team name here',
    token: 'Your access token here',
});
// console.log(q);

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
