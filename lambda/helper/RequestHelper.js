const constants = require('../constants');

module.exports.getOptions = function (accessToken, url = null) {
    return {
        'baseURL': `https://${constants.BASE_URL}/`,
        'url': url,
        'method': 'GET',
        'headers': {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    };
};