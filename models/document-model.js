var document_prefix = '@document_',
    model = module.exports;

model = {

    data: function(name, list){
        return {
            id: model.addPrefix(name),
            format: list.join("\n"),
        };
    },

    hasPrefix: function(key){
        var regex = new RegExp('^' + document_prefix);
        return key.match(regex);
    },

    removePrefix: function(name){
        return name.replace(document_prefix, '');
    },

    addPrefix: function(name){
        return document_prefix + name;
    },

}
