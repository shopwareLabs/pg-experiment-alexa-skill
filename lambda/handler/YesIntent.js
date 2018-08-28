const requestHelper = require('../helper/RequestHelper');
const axios = require('axios');

module.exports = {
    canHandle(handlerInput) {
        let hasProduct = false;
        const request = handlerInput.requestEnvelope.request;
        const attributesManager = handlerInput.attributesManager;
        const sessionAttributes = attributesManager.getSessionAttributes();

        if (sessionAttributes.placeOrderWithProductId !== false) {
            hasProduct = true;
        }

        return hasProduct && request.type === 'IntentRequest' && request.intent.name === 'AMAZON.YesIntent';
    },
    async handle(handlerInput) {
        const { attributesManager, responseBuilder, requestEnvelope } = handlerInput;
        const sessionAttributes = attributesManager.getSessionAttributes();
        const requestAttributes = attributesManager.getRequestAttributes();

        const options = requestHelper.getOptions(requestEnvelope.session.user.accessToken);
        options.method = 'POST';

        const productId = sessionAttributes.placeOrderWithProductId;
        sessionAttributes.placeOrderWithProductId = false;
        sessionAttributes.searchForProductTerm = false;

        options.url = `/storefront-api/checkout/cart/product/${productId}`;
        await axios(options);

        options.url = '/storefront-api/checkout/order';
        axios(options);
        responseBuilder.speak(requestAttributes.t('ORDERHASBEENPLACED')).withShouldEndSession(true);

        attributesManager.setPersistentAttributes(sessionAttributes);

        await attributesManager.savePersistentAttributes();

        return responseBuilder.getResponse();
    },
};