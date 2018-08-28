const requestHelper = require('../helper/RequestHelper');
const textHelper = require('../helper/TextHelper');
const axios = require('axios');
const constants = require('../constants');

module.exports = {
    canHandle(handlerInput) {
        let hasProductId = false;
        const request = handlerInput.requestEnvelope.request;
        const attributesManager = handlerInput.attributesManager;
        const sessionAttributes = attributesManager.getSessionAttributes();

        if (sessionAttributes.placeOrderWithProductId !== false) {
            hasProductId = true;
        }

        return hasProductId && request.type === 'IntentRequest' && request.intent.name === 'DetailsIntent';
    },
    async handle(handlerInput) {
        const { attributesManager, responseBuilder, requestEnvelope } = handlerInput;
        const sessionAttributes = attributesManager.getSessionAttributes();
        const requestAttributes = attributesManager.getRequestAttributes();

        const options = requestHelper.getOptions(requestEnvelope.session.user.accessToken, `/storefront-api/product/${sessionAttributes.placeOrderWithProductId}`);

        const response = await axios(options);
        const product = response.data.data;

        const productOffer = requestAttributes.t('OFFERPRODUCT', { product: product });

        return responseBuilder
            .speak(textHelper.removeTags(textHelper.trimToWordCount(product.descriptionLong, constants.DETAIL_WORD_COUNT)) + '.  ' + productOffer)
            .reprompt(productOffer)
            .getResponse();
    },
};