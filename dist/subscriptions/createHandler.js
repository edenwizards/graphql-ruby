"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var createActionCableHandler_1 = require("./createActionCableHandler");
var createPusherHandler_1 = require("./createPusherHandler");
var createAblyHandler_1 = require("./createAblyHandler");
/**
 * Transport-agnostic wrapper for Relay Modern subscription handlers.
 * @example Add ActionCable subscriptions
 *   var subscriptionHandler = createHandler({
 *     cable: cable,
 *     operations: OperationStoreClient,
 *   })
 *   var network = Network.create(fetchQuery, subscriptionHandler)
 * @param {ActionCable.Consumer} options.cable - A consumer from `.createConsumer`
 * @param {Pusher} options.pusher - A Pusher client
 * @param {Ably.Realtime} options.ably - An Ably client
 * @param {OperationStoreClient} options.operations - A generated `OperationStoreClient` for graphql-pro's OperationStore
 * @return {Function} A handler for a Relay Modern network
*/
function createHandler(options) {
    if (!options) {
        return null;
    }
    var handler;
    if (options.cable) {
        handler = createActionCableHandler_1.createActionCableHandler(options);
    }
    else if (options.pusher) {
        handler = createPusherHandler_1.createPusherHandler(options);
    }
    else if (options.ably) {
        handler = createAblyHandler_1.createAblyHandler(options);
    }
    return handler;
}
exports.default = createHandler;
