"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// State management for subscriptions.
// Used to add subscriptions to an Apollo network intrface.
var ApolloSubscriptionRegistry = /** @class */ (function () {
    function ApolloSubscriptionRegistry() {
        this._id = 1;
        this._subscriptions = {};
    }
    ApolloSubscriptionRegistry.prototype.add = function (subscription) {
        var id = this._id++;
        this._subscriptions[id] = subscription;
        return id;
    };
    ApolloSubscriptionRegistry.prototype.unsubscribe = function (id) {
        var subscription = this._subscriptions[id];
        if (!subscription) {
            throw new Error("No subscription found for id: " + id);
        }
        subscription.unsubscribe();
        delete this._subscriptions[id];
    };
    return ApolloSubscriptionRegistry;
}());
exports.default = new ApolloSubscriptionRegistry;
