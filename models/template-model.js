var template_prefix = '@template_',
    model = module.exports;

model = {

    data: function(name, list){
        return {
            id: model.addPrefix(name),
            format: list.join("\n"),
        };
    },

    hasPrefix: function(key){
        var regex = new RegExp('^' + template_prefix);
        return key.match(regex);
    },

    removePrefix: function(name){
        return name.replace(template_prefix, '');
    },

    addPrefix: function(name){
        return template_prefix + name;
    },

}
