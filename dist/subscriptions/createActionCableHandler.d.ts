import { Cable } from "actioncable";
/**
 * Create a Relay Modern-compatible subscription handler.
 *
 * @param {ActionCable.Consumer} cable - An ActionCable consumer from `.createConsumer`
 * @param {OperationStoreClient} operations - A generated OperationStoreClient for graphql-pro's OperationStore
 * @return {Function}
*/
interface ActionCableHandlerOptions {
    cable: Cable;
    operations?: {
        getOperationId: Function;
    };
}
declare function createActionCableHandler(options: ActionCableHandlerOptions): (operation: {
    text: string;
    name: string;
}, variables: object, _cacheConfig: object, observer: {
    onError: Function;
    onNext: Function;
    onCompleted: Function;
}) => {
    dispose: () => void;
};
export { createActionCableHandler, ActionCableHandlerOptions };
