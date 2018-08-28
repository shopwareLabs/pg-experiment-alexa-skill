/* eslint-disable  func-names */
/* eslint-disable  no-console */
/* eslint-disable  no-restricted-syntax */

const Alexa = require('ask-sdk');

const LaunchRequest = require('handler/LaunchRequest');
const ExitHandler = require('handler/ExitHandler');
const HelpIntent = require('handler/HelpIntent');
const SessionEndedRequest = require('handler/SessionEndedRequest');
const UnhandledIntent = require('handler/UnhandledIntent');
const ErrorHandler = require('handler/ErrorHandler');
const LocalizationInterceptor = require('interceptor/LocalizationInterceptor');
const YesIntent = require('handler/YesIntent');
const NoIntent = require('handler/NoIntent');
const OrderStateIntent = require('handler/OrderStateIntent');
const SearchIntent = require('handler/SearchIntent');
const DetailsIntent = require('handler/DetailsIntent');
const ProductDetailsIntent = require('handler/ProductDetailsIntent');
const NewsIntent = require('handler/NewsIntent');

const skillBuilder = Alexa.SkillBuilders.standard();

exports.handler = skillBuilder
    .addRequestHandlers(
        LaunchRequest,
        YesIntent,
        NoIntent,
        SearchIntent,
        OrderStateIntent,
        DetailsIntent,
        ProductDetailsIntent,
        NewsIntent,
        ExitHandler,
        SessionEndedRequest,
        HelpIntent,
        UnhandledIntent,
    )
    .withTableName('Shopware')
    .withAutoCreateTable(true)
    .addRequestInterceptors(LocalizationInterceptor)
    .addErrorHandlers(ErrorHandler)
    .lambda();