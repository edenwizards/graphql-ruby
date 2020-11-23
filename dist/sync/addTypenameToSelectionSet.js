"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addTypenameIfAbsent = exports.addTypenameToSelectionSet = void 0;
var graphql_1 = require("graphql");
var TYPENAME_FIELD = {
    kind: "Field",
    name: {
        kind: "Name",
        value: "__typename",
    },
    selectionSet: {
        kind: "SelectionSet",
        selections: []
    }
};
function addTypenameIfAbsent(node) {
    if (node.selectionSet) {
        var alreadyHasThisField = node.selectionSet.selections.some(function (selection) {
            return (selection.kind === "Field" && selection.name.value === "__typename");
        });
        if (!alreadyHasThisField) {
            return __assign(__assign({}, node), { selectionSet: __assign(__assign({}, node.selectionSet), { selections: __spreadArrays(node.selectionSet.selections, [TYPENAME_FIELD]) }) });
        }
        else {
            return undefined;
        }
    }
    else {
        return undefined;
    }
}
exports.addTypenameIfAbsent = addTypenameIfAbsent;
function addTypenameToSelectionSet(node) {
    var visitor = {
        Field: {
            leave: addTypenameIfAbsent,
        },
        InlineFragment: {
            leave: addTypenameIfAbsent,
        }
    };
    var newNode = graphql_1.visit(node, visitor);
    return newNode;
}
exports.addTypenameToSelectionSet = addTypenameToSelectionSet;
