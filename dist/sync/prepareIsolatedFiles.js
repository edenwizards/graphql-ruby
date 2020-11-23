"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = __importDefault(require("fs"));
var graphql_1 = require("graphql");
var addTypenameToSelectionSet_1 = require("./addTypenameToSelectionSet");
/**
 * Read a bunch of GraphQL files and treat them as islands.
 * Don't join any fragments from other files.
 * Don't make assertions about name uniqueness.
 *
 */
function prepareIsolatedFiles(filenames, addTypename) {
    return filenames.map(function (filename) {
        var fileOperationBody = fs_1.default.readFileSync(filename, "utf8");
        var fileOperationName = "";
        var ast = graphql_1.parse(fileOperationBody);
        var visitor = {
            OperationDefinition: {
                enter: function (node) {
                    if (fileOperationName.length > 0) {
                        throw new Error("Found multiple operations in " + filename + ": " + fileOperationName + ", " + node.name + ". Files must contain only one operation");
                    }
                    else if (node.name && node.name.value) {
                        fileOperationName = node.name.value;
                    }
                },
            },
            InlineFragment: {
                leave: addTypename ? addTypenameToSelectionSet_1.addTypenameIfAbsent : function () { }
            },
            Field: {
                leave: addTypename ? addTypenameToSelectionSet_1.addTypenameIfAbsent : function () { }
            }
        };
        ast = graphql_1.visit(ast, visitor);
        return {
            // populate alias later, when hashFunc is available
            alias: "",
            name: fileOperationName,
            body: graphql_1.print(ast),
        };
    });
}
exports.default = prepareIsolatedFiles;
