const requestHelper = require('../helper/RequestHelper');
const textHelper = require('../helper/TextHelper');
const axios = require('axios');
const constants = require('../constants');

module.exports = {
    canHandle(handlerInput) {
        const request = handlerInput.requestEnvelope.request;

        return request.type === 'IntentRequest' && request.intent.name === 'ProductDetailsIntent';
    },
    async handle(handlerInput) {
        const { attributesManager, responseBuilder, requestEnvelope } = handlerInput;
        const sessionAttributes = attributesManager.getSessionAttributes();
        const requestAttributes = attributesManager.getRequestAttributes();

        const productSearchTerm = requestEnvelope.request.intent.slots.product.value;
        sessionAttributes.searchForProductTerm = productSearchTerm;

        const options = requestHelper.getOptions(requestEnvelope.session.user.accessToken, `/storefront-api/v1/product?term=${productSearchTerm}&limit=1`);

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

        const offerProduct = requestAttributes.t('OFFERPRODUCT', { product: product });

        return responseBuilder
            .speak(textHelper.removeTags(textHelper.trimToWordCount(product.descriptionLong, constants.DETAIL_WORD_COUNT)) + '. ' + offerProduct)
            .reprompt(offerProduct)
            .getResponse();
    },
};