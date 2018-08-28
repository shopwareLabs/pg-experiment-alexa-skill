const requestHelper = require('../helper/RequestHelper');
const axios = require('axios');

module.exports = {
    canHandle(handlerInput) {
        const request = handlerInput.requestEnvelope.request;

        return request.type === 'IntentRequest' && request.intent.name === 'SearchIntent';
    },
    async handle(handlerInput) {
        const { requestEnvelope, attributesManager, responseBuilder } = handlerInput;
        const sessionAttributes = attributesManager.getSessionAttributes();
        const requestAttributes = handlerInput.attributesManager.getRequestAttributes();

        const productSearchTerm = requestEnvelope.request.intent.slots.product.value;
        sessionAttributes.searchForProductTerm = productSearchTerm;

        const options = requestHelper.getOptions(requestEnvelope.session.user.accessToken, `/storefront-api/product?term=${productSearchTerm}&limit=1`);

        const response = await axios(options);
        const product = response.data.data[0];

        if (!product) {
            return responseBuilder
                .speak(requestAttributes.t('PRODUCTNOTFOUND', { name: productSearchTerm }))
                .reprompt(requestAttributes.t('HELPREPROMPT'))
                .getResponse();
        }

        sessionAttributes.productOffset = 1;
        sessionAttributes.placeOrderWithProductId = product.id;

        attributesManager.setPersistentAttributes(sessionAttributes);

        await attributesManager.savePersistentAttributes();

        const productOffer = requestAttributes.t('OFFERPRODUCT', { product: product });

        return responseBuilder
            .speak(productOffer)
            .reprompt(productOffer)
            .getResponse();
    },
};