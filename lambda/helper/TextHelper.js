module.exports.removeTags = function (text) {
    if (!text || !text.length) {
        return '';
    }

    return text.replace(/<(?:.|\n)*?>/gm, '');
};

module.exports.trimToWordCount = function (text, numWords) {
    const words = text.split(' ');
    if (words.length <= numWords) {
        return text;
    }

    return words.slice(0, numWords).join(' ');
};