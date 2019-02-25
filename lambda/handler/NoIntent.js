const requestHelper = require('../helper/RequestHelper');
const axios = require('axios');

module.exports = {
    canHandle(handlerInput) {
        let hasProduct = false;
        const request = handlerInput.requestEnvelope.request;
        const attributesManager = handlerInput.attributesManager;
        const sessionAttributes = attributesManager.getSessionAttributes();

        if (sessionAttributes.placeOrderWithProductId !== false ||
            sessionAttributes.searchForProductTerm !== false) {
            hasProduct = true;
        }

        return hasProduct && request.type === 'IntentRequest' && request.intent.name === 'AMAZON.NoIntent';
    },
    async handle(handlerInput) {
        const { attributesManager, responseBuilder, requestEnvelope } = handlerInput;
        const sessionAttributes = attributesManager.getSessionAttributes();
        const requestAttributes = attributesManager.getRequestAttributes();

        switch (true) {
            case sessionAttributes.placeOrderWithProductId !== false:
                sessionAttributes.productOffset += 1;

                if (sessionAttributes.productOffset > 3) {
                    responseBuilder.speak(requestAttributes.t('DONOTORDER')).withShouldEndSession(true);
                    break;
                }

                const options = requestHelper.getOptions(requestEnvelope.session.user.accessToken, `/storefront-api/v1/product?term=${sessionAttributes.searchForProductTerm}&limit=1&page=${sessionAttributes.productOffset}`);

                const response = await axios(options);
                const product = response.data.data[0];

                sessionAttributes.placeOrderWithProductId = product.id;

                responseBuilder.speak(requestAttributes.t('OFFERALTERNATIVEPRODUCT', { product: product })).withShouldEndSession(false);
                break;
            default:
                break;
        }

        attributesManager.setPersistentAttributes(sessionAttributes);

        await attributesManager.savePersistentAttributes();

        return responseBuilder.getResponse();
    },
};