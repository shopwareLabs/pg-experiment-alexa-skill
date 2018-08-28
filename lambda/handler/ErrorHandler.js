module.exports = {
    canHandle() {
        return true;
    },
    handle(handlerInput, error) {
        console.log(`Error handled: ${error.message}`);
        const responseBuilder = handlerInput.responseBuilder;
        const requestAttributes = handlerInput.attributesManager.getRequestAttributes();

        return responseBuilder
            .speak(requestAttributes.t('UNKNOWNCOMMAND'))
            .reprompt(requestAttributes.t('HELPREPROMPT'))
            .getResponse();
    },
};