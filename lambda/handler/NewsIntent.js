const requestHelper = require('../helper/RequestHelper');
const axios = require('axios');

module.exports = {
    canHandle(handlerInput) {
        const request = handlerInput.requestEnvelope.request;

        return request.type === 'IntentRequest' && request.intent.name === 'NewsIntent';
    },
    async handle(handlerInput) {
        const { attributesManager, responseBuilder, requestEnvelope } = handlerInput;
        const requestAttributes = attributesManager.getRequestAttributes();

        const options = requestHelper.getOptions(requestEnvelope.session.user.accessToken, `/storefront-api/product?sort=-createdAt&limit=5`);

        const response = await axios(options);
        let products = response.data.data;

        return responseBuilder
            .speak(requestAttributes.t(`NEWPRODUCTS`, {
                products0: products[0],
                products1: products[1],
                products2: products[2]
            }))
            .getResponse();
    },
};