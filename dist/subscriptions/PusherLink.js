"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.getObserver = void 0;
// An Apollo Link for using graphql-pro's Pusher subscriptions
//
// @example Adding subscriptions to a HttpLink
//   // Load Pusher and create a client
//   import Pusher from "pusher-js"
//   var pusherClient = new Pusher("your-app-key", { cluster: "us2" })
//
//   // Build a combined link, initialize the client:
//   const pusherLink = new PusherLink({pusher: pusherClient})
//   const link = ApolloLink.from([authLink, pusherLink, httpLink])
//   const client = new ApolloClient(link: link, ...)
//
// @example Building a subscription, then subscribing to it
//  subscription = client.subscribe({
//    variables: { room: roomName},
//    query: gql`
//      subscription MessageAdded($room: String!) {
//        messageWasAdded(room: $room) {
//          room {
//            messages {
//              id
//              body
//              author {
//                screenname
//              }
//            }
//          }
//        }
//      }
//       `
//   })
//
//   subscription.subscribe({ next: ({data, errors}) => {
//     // Do something with `data` and/or `errors`
//   }})
//
var apollo_link_1 = require("apollo-link");
var PusherLink = /** @class */ (function (_super) {
    __extends(PusherLink, _super);
    function PusherLink(options) {
        var _this = _super.call(this) || this;
        // Retain a handle to the Pusher client
        _this.pusher = options.pusher;
        return _this;
    }
    PusherLink.prototype.request = function (operation, forward) {
        var _this = this;
        var subscribeObservable = new apollo_link_1.Observable(function (_observer) { });
        var pusher = this.pusher;
        // Capture the super method
        var prevSubscribe = subscribeObservable.subscribe.bind(subscribeObservable);
        // Override subscribe to return an `unsubscribe` object, see
        // https://github.com/apollographql/subscriptions-transport-ws/blob/master/src/client.ts#L182-L212
        subscribeObservable.subscribe = function (observerOrNext, onError, onComplete) {
            // Call super
            prevSubscribe(observerOrNext, onError, onComplete);
            var observer = getObserver(observerOrNext, onError, onComplete);
            var subscriptionChannel;
            // Check the result of the operation
            var resultObservable = forward(operation);
            // When the operation is done, try to get the subscription ID from the server
            resultObservable.subscribe({
                next: function (data) {
                    // If the operation has the subscription header, it's a subscription
                    var response = operation.getContext().response;
                    // Check to see if the response has the header
                    subscriptionChannel = response.headers.get("X-Subscription-ID");
                    if (subscriptionChannel) {
                        // Set up the pusher subscription for updates from the server
                        var pusherChannel = _this.pusher.subscribe(subscriptionChannel);
                        // Subscribe for more update
                        pusherChannel.bind("update", function (payload) {
                            if (!payload.more) {
                                // This is the end, the server says to unsubscribe
                                pusher.unsubscribe(subscriptionChannel);
                                observer.complete();
                            }
                            var result = payload.result;
                            if (result) {
                                // Send the new response to listeners
                                observer.next(result);
                            }
                        });
                    }
                    else {
                        // This isn't a subscription,
                        // So pass the data along and close the observer.
                        observer.next(data);
                        observer.complete();
                    }
                },
                error: function (err) {
                    observer.error(err);
                }
            });
            // Return an object that will unsubscribe _if_ the query was a subscription.
            return {
                closed: false,
                unsubscribe: function () {
                    subscriptionChannel && _this.pusher.unsubscribe(subscriptionChannel);
                }
            };
        };
        return subscribeObservable;
    };
    return PusherLink;
}(apollo_link_1.ApolloLink));
// Turn `subscribe` arguments into an observer-like thing, see getObserver
// https://github.com/apollographql/subscriptions-transport-ws/blob/master/src/client.ts#L329-L343
function getObserver(observerOrNext, onError, onComplete) {
    if (typeof observerOrNext === "function") {
        // Duck-type an observer
        return {
            next: function (v) { return observerOrNext(v); },
            error: function (e) { return onError && onError(e); },
            complete: function () { return onComplete && onComplete(); }
        };
    }
    else {
        // Make an object that calls to the given object, with safety checks
        return {
            next: function (v) { return observerOrNext.next && observerOrNext.next(v); },
            error: function (e) { return observerOrNext.error && observerOrNext.error(e); },
            complete: function () { return observerOrNext.complete && observerOrNext.complete(); }
        };
    }
}
exports.getObserver = getObserver;
exports.default = PusherLink;
