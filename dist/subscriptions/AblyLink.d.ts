import { ApolloLink, Observable, FetchResult, NextLink, Operation } from "apollo-link";
import { Realtime } from "ably";
declare type RequestResult = Observable<FetchResult<{
    [key: string]: any;
}, Record<string, any>, Record<string, any>>>;
declare class AblyLink extends ApolloLink {
    ably: Realtime;
    constructor(options: {
        ably: Realtime;
    });
    request(operation: Operation, forward: NextLink): RequestResult;
    _getSubscriptionChannel(operation: Operation): {
        channel: any;
        key: any;
    };
    _createSubscription(subscriptionChannelConfig: {
        channel: string;
        key: string;
    }, observer: {
        next: Function;
        complete: Function;
    }): void;
}
export default AblyLink;
