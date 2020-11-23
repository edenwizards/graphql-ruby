"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAblyHandler = void 0;
var anonymousClientId = "graphql-subscriber";
// Current max. number of rewound messages in the initial response to
// subscribe. See
// https://github.com/ably/docs/blob/baa0a4666079abba3a3e19e82eb99ca8b8a735d0/content/realtime/channels/channel-parameters/rewind.textile#additional-information
// Note that using a higher value emits a warning.
var maxNumRewindMessages = 100;
var AblyError = /** @class */ (function () {
    function AblyError(reason) {
        var error = Error(reason.message);
        var attributes = ["code", "statusCode"];
        attributes.forEach(function (attr) {
            Object.defineProperty(error, attr, {
                get: function () {
                    return reason[attr];
                }
            });
        });
        Error.captureStackTrace(error, AblyError);
        return error;
    }
    return AblyError;
}());
function createAblyHandler(options) {
    var _this = this;
    var ably = options.ably, fetchOperation = options.fetchOperation;
    var isAnonymousClient = function () {
        return !ably.auth.clientId || ably.auth.clientId === "*";
    };
    return function (operation, variables, cacheConfig, observer) {
        var channel = null;
        var dispatchResult = function (result) {
            if (result) {
                if (result.errors) {
                    // What kind of error stuff belongs here?
                    observer.onError(result.errors);
                }
                else if (result.data) {
                    observer.onNext({ data: result.data });
                }
            }
        };
        var updateHandler = function (message) {
            // TODO Extract this code
            // When we get a response, send the update to `observer`
            var payload = message.data;
            dispatchResult(payload.result);
            if (!payload.more) {
                // Subscription is finished
                observer.onCompleted();
            }
        };
        (function () { return __awaiter(_this, void 0, void 0, function () {
            var response, channelName, channelKey, enterCallback, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, fetchOperation(operation, variables, cacheConfig)];
                    case 1:
                        response = _a.sent();
                        channelName = response.headers.get("X-Subscription-ID");
                        if (!channelName) {
                            throw new Error("Missing X-Subscription-ID header");
                        }
                        channelKey = response.headers.get("X-Subscription-Key");
                        channel = ably.channels.get(channelName, {
                            params: { rewind: String(maxNumRewindMessages) },
                            cipher: channelKey ? { key: channelKey } : undefined,
                            modes: ["SUBSCRIBE", "PRESENCE"]
                        });
                        channel.on("failed", function (stateChange) {
                            observer.onError(stateChange.reason
                                ? new AblyError(stateChange.reason)
                                : new Error("Ably channel changed to failed state"));
                        });
                        channel.on("suspended", function (stateChange) {
                            // Note: suspension can be a temporary condition and isn't necessarily
                            // an error, however we handle the case where the channel gets
                            // suspended before it is attached because that's the only way to
                            // propagate error 90010 (see https://help.ably.io/error/90010)
                            if (stateChange.previous === "attaching" &&
                                stateChange.current === "suspended") {
                                observer.onError(stateChange.reason
                                    ? new AblyError(stateChange.reason)
                                    : new Error("Ably channel suspended before being attached"));
                            }
                        });
                        enterCallback = function (errorInfo) {
                            if (errorInfo && channel) {
                                observer.onError(new AblyError(errorInfo));
                            }
                        };
                        if (isAnonymousClient()) {
                            channel.presence.enterClient(anonymousClientId, "subscribed", enterCallback);
                        }
                        else {
                            channel.presence.enter("subscribed", enterCallback);
                        }
                        // When you get an update from ably, give it to Relay
                        channel.subscribe("update", updateHandler);
                        // Dispatch the result _after_ setting up the channel,
                        // because Relay might immediately dispose of the subscription.
                        // (In that case, we want to make sure the channel is cleaned up properly.)
                        dispatchResult(response.body);
                        return [3 /*break*/, 3];
                    case 2:
                        error_1 = _a.sent();
                        observer.onError(error_1);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); })();
        return {
            dispose: function () { return __awaiter(_this, void 0, void 0, function () {
                var disposedChannel_1, error_2;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 5, , 6]);
                            if (!channel) return [3 /*break*/, 4];
                            disposedChannel_1 = channel;
                            channel = null;
                            disposedChannel_1.unsubscribe();
                            if (!(disposedChannel_1.state === "attaching")) return [3 /*break*/, 2];
                            return [4 /*yield*/, new Promise(function (resolve, _reject) {
                                    var onStateChange = function (stateChange) {
                                        if (stateChange.current !== "attaching") {
                                            disposedChannel_1.off(onStateChange);
                                            resolve();
                                        }
                                    };
                                    disposedChannel_1.on(onStateChange);
                                })];
                        case 1:
                            _a.sent();
                            _a.label = 2;
                        case 2: return [4 /*yield*/, new Promise(function (resolve, reject) {
                                disposedChannel_1.detach(function (err) {
                                    if (err) {
                                        reject(new AblyError(err));
                                    }
                                    else {
                                        resolve();
                                    }
                                });
                            })];
                        case 3:
                            _a.sent();
                            ably.channels.release(disposedChannel_1.name);
                            _a.label = 4;
                        case 4: return [3 /*break*/, 6];
                        case 5:
                            error_2 = _a.sent();
                            observer.onError(error_2);
                            return [3 /*break*/, 6];
                        case 6: return [2 /*return*/];
                    }
                });
            }); }
        };
    };
}
exports.createAblyHandler = createAblyHandler;
