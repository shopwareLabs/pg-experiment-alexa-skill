const requestHelper = require('../helper/RequestHelper');
const axios = require('axios');

module.exports = {
    canHandle(handlerInput) {
        const request = handlerInput.requestEnvelope.request;

        return request.type === 'IntentRequest' && request.intent.name === 'OrderStateIntent';
    },
    async handle(handlerInput) {
        const { requestEnvelope, attributesManager, responseBuilder } = handlerInput;
        const requestAttributes = attributesManager.getRequestAttributes();
        const request = requestEnvelope.request;

        const options = requestHelper.getOptions(requestEnvelope.session.user.accessToken, '/storefront-api/customer/orders?limit=1');

        let order = null;
        let response = await axios(options);
        response = response.data;
        let orders = response.data;
        order = orders[Object.keys(orders)[0]];
        const date = new Date(Date.parse(order.date));
        const dateFormat = date.toLocaleDateString(request.locale);

        return responseBuilder
            .speak(requestAttributes.t('ORDERSTATE', { order: order, date: dateFormat }))
            .getResponse();
    }
};