"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Logger = /** @class */ (function () {
    function Logger(isQuiet) {
        this.isQuiet = isQuiet;
    }
    Logger.prototype.log = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        this.isQuiet ? null : console.log.apply(console, args);
    };
    Logger.prototype.error = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        this.isQuiet ? null : console.error.apply(console, args);
    };
    Logger.prototype.colorize = function (color, text) {
        var prefix = colors[color];
        if (!prefix) {
            throw new Error("No color named: " + color);
        }
        return prefix + text + colors.reset;
    };
    // Shortcuts to `.colorize`, add more as-needed.
    Logger.prototype.red = function (text) {
        return this.colorize("red", text);
    };
    Logger.prototype.green = function (text) {
        return this.colorize("green", text);
    };
    Logger.prototype.bright = function (text) {
        return this.colorize("bright", text);
    };
    return Logger;
}());
var colors = {
    yellow: "\x1b[33m",
    red: "\x1b[31m",
    green: "\x1b[32m",
    blue: "\x1b[34m",
    magenta: "\x1b[35m",
    cyan: "\x1b[36m",
    reset: "\x1b[0m",
    bright: "\x1b[1m",
    dim: "\x1b[2m",
};
exports.default = Logger;
