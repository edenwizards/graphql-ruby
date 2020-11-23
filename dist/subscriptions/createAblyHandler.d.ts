import { Realtime } from "ably";
interface AblyHandlerOptions {
    ably: Realtime;
    fetchOperation: Function;
}
interface ApolloObserver {
    onError: Function;
    onNext: Function;
    onCompleted: Function;
}
declare function createAblyHandler(options: AblyHandlerOptions): (operation: object, variables: object, cacheConfig: object, observer: ApolloObserver) => {
    dispose: () => Promise<void>;
};
export { createAblyHandler, AblyHandlerOptions };
