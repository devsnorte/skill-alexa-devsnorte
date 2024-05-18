const axios = require('axios');
const Alexa = require('ask-sdk-core');

const DOCUMENT_ID = "interface";

const datasource = {
    "cardsLayoutTemplateData": {
        "type": "object",
        "properties": {
            "backgroundImage": "https://th.bing.com/th/id/OIP.FQ5Y0sgHAeN9cceTpkguvQHaD4?w=244&h=181&c=7&r=0&o=5&pid=1.7",
            "headerTitle": "",
            "headerSubtitle": "",
            "headerAttributionImage": "https://raw.githubusercontent.com/devsnorte/artworks/9eb26d332f478036220c43042e6039f04d827486/vector/logo-dark.svg",
            "primaryText": "Eventos da Comunidade Devs Norte",
            "listItems": []
        }
    }
};

const createDirectivePayload = (aplDocumentId, dataSources = {}, tokenId = "documentToken") => {
    return {
        type: "Alexa.Presentation.APL.RenderDocument",
        token: tokenId,
        document: {
            type: "Link",
            src: "doc://alexa/apl/documents/" + aplDocumentId
        },
        datasources: dataSources
    }
};

const fetchEvents = async (eventType) => {
    const url = 'https://www.sympla.com.br/api/v1/search';
    const body = {
        service: eventType === 'future' ? "/v4/search" : "/v4/events/past",
        params: {
            only: "name,images,location,start_date_formats,end_date_formats,url",
            organizer_id: [3125215, 5478152],
            sort: "date",
            order_by: "desc",
            limit: "6",
            page: 1,
        },
        ignoreLocation: true,
    };

    try {
        const response = await axios.post(url, body, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response.data.data;
    } catch (error) {
        console.error("Erro ao buscar eventos:", error);
        throw new Error("Erro ao buscar eventos");
    }
};

const GetFutureEventsHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'LaunchRequest' ||
            (handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
                handlerInput.requestEnvelope.request.intent.name === 'GetFutureEventsIntent');
    },
    async handle(handlerInput) {
        let outputSpeech = 'Aqui estão os próximos eventos da comunidade Devs Norte: ';

        try {
            const events = await fetchEvents('future');
            if (!events || events.length === 0) {
                datasource.cardsLayoutTemplateData.properties.listItems = [];
                outputSpeech += 'Não há eventos futuros no momento. Você gostaria de saber sobre eventos passados?';
            } else {
                events.forEach((event, index) => {
                    outputSpeech += `Evento ${event.name}. Será realizado em ${event.location.city}, no dia ${event.start_date_formats.pt}. Para mais informações, acesse: ${event.url}. `;
                });
                datasource.cardsLayoutTemplateData.properties.listItems = events.map(event => ({
                    primaryText: event.name,
                    secondaryText: `${event.location.city} - ${event.start_date_formats.pt}`,
                    thumbnailImage: event.images.original
                }));
                outputSpeech += 'Você gostaria de saber mais sobre algum desses eventos ou perguntar sobre eventos passados?';
            }
        } catch (err) {
            console.error(err);
            outputSpeech = 'Desculpe, ocorreu um erro ao buscar os eventos. Você gostaria de tentar novamente ou perguntar sobre outra coisa?';
        }

        const aplDirective = createDirectivePayload(DOCUMENT_ID, datasource);
        handlerInput.responseBuilder.addDirective(aplDirective);

        return handlerInput.responseBuilder
            .speak(outputSpeech)
            .reprompt('O que você gostaria de saber?')
            .withShouldEndSession(false)
            .getResponse();
    },
};

const GetPastEventsHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
            handlerInput.requestEnvelope.request.intent.name === 'GetPastEventsIntent';
    },
    async handle(handlerInput) {
        let outputSpeech = 'Aqui estão alguns dos eventos passados da comunidade Devs Norte: ';

        try {
            const events = await fetchEvents('past');
            if (!events || events.length === 0) {
                datasource.cardsLayoutTemplateData.properties.listItems = [];
                outputSpeech += 'Não há eventos passados no momento. Você gostaria de saber sobre eventos futuros?';
            } else {
                events.forEach((event, index) => {
                    outputSpeech += `Evento ${event.name}. Foi realizado em ${event.location.city}, no dia ${event.start_date_formats.pt}. `;
                });
                datasource.cardsLayoutTemplateData.properties.listItems = events.map(event => ({
                    primaryText: event.name,
                    secondaryText: `${event.location.city} - ${event.start_date_formats.pt}`,
                    thumbnailImage: event.images.original
                }));
                outputSpeech += 'Você gostaria de saber sobre eventos futuros ou alguma outra informação?';
            }
        } catch (err) {
            console.error(err);
            datasource.cardsLayoutTemplateData.properties.listItems = [];
            outputSpeech = 'Desculpe, ocorreu um erro ao buscar os eventos. Você gostaria de tentar novamente ou perguntar sobre outra coisa?';
        }

        const aplDirective = createDirectivePayload(DOCUMENT_ID, datasource);
        handlerInput.responseBuilder.addDirective(aplDirective);

        return handlerInput.responseBuilder
            .speak(outputSpeech)
            .reprompt('O que você gostaria de saber?')
            .withShouldEndSession(false)
            .getResponse();
    },
};

const HelpIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
            handlerInput.requestEnvelope.request.intent.name === 'AMAZON.HelpIntent';
    },
    handle(handlerInput) {
        const speechText = 'Você pode me pedir para listar eventos futuros ou passados da comunidade Devs Norte. O que você gostaria de fazer?';

        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt('Por favor, diga-me o que você gostaria de fazer.')
            .withShouldEndSession(false)
            .getResponse();
    },
};

const ErrorHandler = {
    canHandle() {
        return true;
    },
    handle(handlerInput, error) {
        console.log(`Error handled: ${error.message}`);

        return handlerInput.responseBuilder
            .speak('Desculpe, ocorreu um erro ao processar sua solicitação. Tente novamente mais tarde.')
            .reprompt('Desculpe, ocorreu um erro ao processar sua solicitação. Tente novamente mais tarde.')
            .getResponse();
    },
};

const skillBuilder = Alexa.SkillBuilders.custom();

exports.handler = skillBuilder
    .addRequestHandlers(
        GetFutureEventsHandler,
        GetPastEventsHandler,
        HelpIntentHandler
    )
    .addErrorHandlers(ErrorHandler)
    .lambda();