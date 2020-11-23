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
var apollo_link_1 = require("apollo-link");
var graphql_1 = require("graphql");
var ActionCableLink = /** @class */ (function (_super) {
    __extends(ActionCableLink, _super);
    function ActionCableLink(options) {
        var _this = _super.call(this) || this;
        _this.cable = options.cable;
        _this.channelName = options.channelName || "GraphqlChannel";
        _this.actionName = options.actionName || "execute";
        _this.connectionParams = options.connectionParams || {};
        return _this;
    }
    // Interestingly, this link does _not_ call through to `next` because
    // instead, it sends the request to ActionCable.
    ActionCableLink.prototype.request = function (operation, _next) {
        var _this = this;
        return new apollo_link_1.Observable(function (observer) {
            var channelId = Math.round(Date.now() + Math.random() * 100000).toString(16);
            var actionName = _this.actionName;
            var subscription = _this.cable.subscriptions.create(Object.assign({}, {
                channel: _this.channelName,
                channelId: channelId
            }, _this.connectionParams), {
                connected: function () {
                    this.perform(actionName, {
                        query: operation.query ? graphql_1.print(operation.query) : null,
                        variables: operation.variables,
                        // This is added for persisted operation support:
                        operationId: operation.operationId,
                        operationName: operation.operationName
                    });
                },
                received: function (payload) {
                    if (payload.result.data || payload.result.errors) {
                        observer.next(payload.result);
                    }
                    if (!payload.more) {
                        observer.complete();
                    }
                }
            });
            // Make the ActionCable subscription behave like an Apollo subscription
            return Object.assign(subscription, { closed: false });
        });
    };
    return ActionCableLink;
}(apollo_link_1.ApolloLink));
exports.default = ActionCableLink;
