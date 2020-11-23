import { ActionCableHandlerOptions } from "./createActionCableHandler";
import { PusherHandlerOptions } from "./createPusherHandler";
import { AblyHandlerOptions } from "./createAblyHandler";
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
declare function createHandler(options: ActionCableHandlerOptions | PusherHandlerOptions | AblyHandlerOptions): ((operation: {
    text: string;
    name: string;
}, variables: object, _cacheConfig: object, observer: {
    onError: Function;
    onNext: Function;
    onCompleted: Function;
}) => {
    dispose: () => void;
}) | null | undefined;
export default createHandler;
