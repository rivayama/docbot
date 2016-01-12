var document_prefix = '@document_',
    model = module.exports;

model.save = function(name, doc, controller, cb){
    var data = model.data(name, doc);
    controller.storage.channels.save(data, function(err, id){
        if (id) {
            cb(null, id);
        } else {
            cb(true);
        }
    });
};

model.all = function(controller, cb){
    controller.storage.channels.all(function(err, all_channel_data){
        if (all_channel_data) {
            var keys = Object.keys(all_channel_data).filter(model.hasPrefix);
            cb(null, keys.map(model.removePrefix));
        } else {
            cb(true);
        }
    });
};

model.get = function(name, controller, cb){
    var id = model.addPrefix(name);
    controller.storage.channels.get(id, function(err, data){
        if (data) {
            cb(null, data);
        } else {
            cb(true);
        }
    });
};


model.data = function(name, doc){
    return {
        id: model.addPrefix(name),
        text: doc,
    };
};
model.hasPrefix = function(key){
    var regex = new RegExp('^' + document_prefix);
    return key.match(regex);
};
model.removePrefix = function(name){
    return name.replace(document_prefix, '');
};
model.addPrefix = function(name){
    return document_prefix + name;
};

