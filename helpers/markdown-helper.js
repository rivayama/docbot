var helper = module.exports;

helper.h1 = function(text) {
    return '# ' + text + helper.lineBreak();
};

helper.h2 = function(text) {
    return '## ' + text + helper.lineBreak();
};

helper.italic = function(text) {
    return '_' + text + '_';
};

helper.command = function(text) {
    return '`' + text + '`';
};

helper.indent = function() {
    return '\t';
};

helper.lineBreak = function() {
    return "\n";
};

helper.changeTopic = function() {
    return "\n\n";
};
