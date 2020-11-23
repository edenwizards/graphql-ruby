#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var minimist_1 = __importDefault(require("minimist"));
var index_1 = __importDefault(require("./sync/index"));
var argv = minimist_1.default(process.argv.slice(2));
if (argv.help || argv.h) {
    console.log("usage: graphql-ruby-client sync <options>\n\n  Read .graphql files and push the contained\n  operations to a GraphQL::Pro::OperationStore\n\nrequired arguments:\n  --url=<endpoint-url>    URL where data should be POSTed\n  --client=<client-name>  Identifier for this client application\n\noptional arguments:\n  --path=<path>                             Path to .graphql files (default is \"./**/*.graphql\")\n  --outfile=<generated-filename>            Target file for generated code\n  --outfile-type=<type>                     Target type for generated code (default is \"js\")\n  --key=<key>                               HMAC authentication key\n  --relay-persisted-output=<path>           Path to a .json file from \"relay-compiler ... --persist-output\"\n                                              (Outfile generation is skipped by default.)\n  --apollo-android-operation-output=<path>  Path to a .json file from Apollo-Android's \"generateOperationOutput\" feature.\n                                              (Outfile generation is skipped by default.)\n  --mode=<mode>                             Treat files like a certain kind of project:\n                                              relay: treat files like relay-compiler output\n                                              project: treat files like a cohesive project (fragments are shared, names must be unique)\n                                              file: treat each file like a stand-alone operation\n\n                                            By default, this flag is set to:\n                                              - \"relay\" if \"__generated__\" in the path\n                                              - otherwise, \"project\"\n  --add-typename                            Automatically adds the \"__typename\" field to your queries\n  --quiet                                   Suppress status logging\n  --verbose                                 Print debug output\n  --help                                    Print this message\n");
}
else {
    var commandName = argv._[0];
    if (commandName !== "sync") {
        console.log("Only `graphql-ruby-client sync` is supported");
    }
    else {
        var result = index_1.default({
            path: argv.path,
            relayPersistedOutput: argv["relay-persisted-output"],
            apolloAndroidOperationOutput: argv["apollo-android-operation-output"],
            url: argv.url,
            client: argv.client,
            outfile: argv.outfile,
            outfileType: argv["outfile-type"],
            secret: argv.secret,
            mode: argv.mode,
            addTypename: argv["add-typename"],
            quiet: argv.hasOwnProperty("quiet"),
            verbose: argv.hasOwnProperty("verbose"),
        });
        result.then(function () {
            process.exit(0);
        }).catch(function () {
            // The error is logged by the function
            process.exit(1);
        });
    }
}
