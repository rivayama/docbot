var template_prefix = '@template_',
    model = module.exports;

model.data = function(name, list){
    return {
        id: model.addPrefix(name),
        format: list.join("\n"),
    };
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

model.hasPrefix = function(key){
    var regex = new RegExp('^' + template_prefix);
    return key.match(regex);
};

model.removePrefix = function(name){
    return name.replace(template_prefix, '');
};

model.addPrefix = function(name){
    return template_prefix + name;
};

