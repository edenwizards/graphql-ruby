import { ApolloLink, Observable, Operation, NextLink, FetchResult } from "apollo-link";
import { Pusher } from "pusher-js";
declare type RequestResult = Observable<FetchResult<{
    [key: string]: any;
}, Record<string, any>, Record<string, any>>>;
declare class PusherLink extends ApolloLink {
    pusher: Pusher;
    constructor(options: {
        pusher: Pusher;
    });
    request(operation: Operation, forward: NextLink): RequestResult;
}
declare function getObserver(observerOrNext: Function | {
    next: Function;
    error: Function;
    complete: Function;
}, onError: Function, onComplete: Function): {
    next: (v: object) => any;
    error: (e: object) => any;
    complete: () => any;
};
export default PusherLink;
export { getObserver };
