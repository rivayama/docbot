var helper = module.exports;

helper.h1 = function(text) {
    return '# ' + text + helper.lineBreak();
};

helper.h2 = function(text) {
    return '## ' + text + helper.lineBreak();
};

helper.lineBreak = function() {
    return "--";
};

helper.changeTopic = function() {
    return "____";
};
