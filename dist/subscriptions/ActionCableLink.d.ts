import { ApolloLink, Observable, FetchResult, Operation, NextLink } from "apollo-link";
import { Cable } from "actioncable";
declare type RequestResult = Observable<FetchResult<{
    [key: string]: any;
}, Record<string, any>, Record<string, any>>>;
declare class ActionCableLink extends ApolloLink {
    cable: Cable;
    channelName: string;
    actionName: string;
    connectionParams: object;
    constructor(options: {
        cable: Cable;
        channelName?: string;
        actionName?: string;
        connectionParams?: object;
    });
    request(operation: Operation, _next: NextLink): RequestResult;
}
export default ActionCableLink;
