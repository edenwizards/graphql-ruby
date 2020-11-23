"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createActionCableHandler = void 0;
function createActionCableHandler(options) {
    return function (operation, variables, _cacheConfig, observer) {
        // unique-ish
        var channelId = Math.round(Date.now() + Math.random() * 100000).toString(16);
        var cable = options.cable;
        var operations = options.operations;
        // Register the subscription by subscribing to the channel
        var subscription = cable.subscriptions.create({
            channel: "GraphqlChannel",
            channelId: channelId,
        }, {
            connected: function () {
                var channelParams;
                // Once connected, send the GraphQL data over the channel
                // Use the stored operation alias if possible
                if (operations) {
                    channelParams = {
                        variables: variables,
                        operationName: operation.name,
                        operationId: operations.getOperationId(operation.name)
                    };
                }
                else {
                    channelParams = {
                        variables: variables,
                        operationName: operation.name,
                        query: operation.text
                    };
                }
                this.perform("execute", channelParams);
            },
            // This result is sent back from ActionCable.
            received: function (payload) {
                // When we get a response, send the update to `observer`
                var result = payload.result;
                if (result && result.errors) {
                    // What kind of error stuff belongs here?
                    observer.onError(result.errors);
                }
                else if (result) {
                    observer.onNext({ data: result.data });
                }
                if (!payload.more) {
                    // Subscription is finished
                    observer.onCompleted();
                }
            }
        });
        // Return an object for Relay to unsubscribe with
        return {
            dispose: function () {
                subscription.unsubscribe();
            }
        };
    };
}
exports.createActionCableHandler = createActionCableHandler;
