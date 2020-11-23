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
// An Apollo Link for using graphql-pro's Ably subscriptions
//
// @example Adding subscriptions to a HttpLink
//   // Load Ably and create a client
//   var Ably = require('ably')
//   // Be sure to create an API key with "Subscribe" and "Presence" permissions only,
//   // and use that limited API key here:
//   var ablyClient = new Ably.Realtime({ key: "yourapp.key:secret" })
//
//   // Build a combined link, initialize the client:
//   const ablyLink = new AblyLink({ably: ablyClient})
//   const link = ApolloLink.from([authLink, ablyLink, httpLink])
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
var AblyLink = /** @class */ (function (_super) {
    __extends(AblyLink, _super);
    function AblyLink(options) {
        var _this = _super.call(this) || this;
        // Retain a handle to the Ably client
        _this.ably = options.ably;
        return _this;
    }
    AblyLink.prototype.request = function (operation, forward) {
        var _this = this;
        return new apollo_link_1.Observable(function (observer) {
            // Check the result of the operation
            forward(operation).subscribe({ next: function (data) {
                    // If the operation has the subscription header, it's a subscription
                    var subscriptionChannelConfig = _this._getSubscriptionChannel(operation);
                    if (subscriptionChannelConfig) {
                        // This will keep pushing to `.next`
                        _this._createSubscription(subscriptionChannelConfig, observer);
                    }
                    else {
                        // This isn't a subscription,
                        // So pass the data along and close the observer.
                        observer.next(data);
                        observer.complete();
                    }
                } });
        });
    };
    AblyLink.prototype._getSubscriptionChannel = function (operation) {
        var response = operation.getContext().response;
        // Check to see if the response has the header
        var subscriptionChannel = response.headers.get("X-Subscription-ID");
        // The server returns this header when encryption is enabled.
        var cipherKey = response.headers.get("X-Subscription-Key");
        return { channel: subscriptionChannel, key: cipherKey };
    };
    AblyLink.prototype._createSubscription = function (subscriptionChannelConfig, observer) {
        var subscriptionChannel = subscriptionChannelConfig["channel"];
        var subscriptionKey = subscriptionChannelConfig["key"];
        var ablyOptions = subscriptionKey ? { cipher: { key: subscriptionKey } } : {};
        var ablyChannel = this.ably.channels.get(subscriptionChannel, ablyOptions);
        var ablyClientId = this.ably.auth.clientId;
        // Register presence, so that we can detect empty channels and clean them up server-side
        if (ablyClientId) {
            ablyChannel.presence.enter();
        }
        else {
            ablyChannel.presence.enterClient("graphql-subscriber", "subscribed");
        }
        // Subscribe for more update
        ablyChannel.subscribe("update", function (message) {
            var payload = message.data;
            if (!payload.more) {
                // This is the end, the server says to unsubscribe
                if (ablyClientId) {
                    ablyChannel.presence.leave();
                }
                else {
                    ablyChannel.presence.leaveClient("graphql-subscriber");
                }
                ablyChannel.unsubscribe();
                observer.complete();
            }
            var result = payload.result;
            if (result) {
                // Send the new response to listeners
                observer.next(result);
            }
        });
    };
    return AblyLink;
}(apollo_link_1.ApolloLink));
exports.default = AblyLink;
