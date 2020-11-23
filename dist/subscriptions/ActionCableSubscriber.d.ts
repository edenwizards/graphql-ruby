import { Cable } from "actioncable";
interface ApolloNetworkInterface {
    applyMiddlewares: Function;
    query: (req: object) => Promise<any>;
    _opts: any;
}
declare class ActionCableSubscriber {
    _cable: Cable;
    _networkInterface: ApolloNetworkInterface;
    constructor(cable: Cable, networkInterface: ApolloNetworkInterface);
    /**
     * Send `request` over ActionCable (`registry._cable`),
     * calling `handler` with any incoming data.
     * Return the subscription so that the registry can unsubscribe it later.
     * @param {Object} registry
     * @param {Object} request
     * @param {Function} handler
     * @return {ID} An ID for unsubscribing
    */
    subscribe(request: any, handler: any): number;
    unsubscribe(id: number): void;
}
export default ActionCableSubscriber;
