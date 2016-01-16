var template_prefix = '@template_',
    model = module.exports;

model.save = function(name, list, controller, cb){
    var data = model.data(name, list);
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
            var keys = all_channel_data.filter(model.hasPrefix).filter(model.getId);
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

model.data = function(name, list){
    return {
        id: model.addPrefix(name),
        format: list.join("\n"),
    };
};
model.getId = function(obj){
    return obj.id;
};
model.hasPrefix = function(obj){
    var regex = new RegExp('^' + template_prefix);
    return obj.id.match(regex);
};
model.removePrefix = function(name){
    return name.replace(template_prefix, '');
};
model.addPrefix = function(name){
    return template_prefix + name;
};

