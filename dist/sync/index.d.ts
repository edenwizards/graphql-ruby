import { ClientOperation } from "./generateClient";
interface SyncOptions {
    path?: string;
    relayPersistedOutput?: string;
    apolloAndroidOperationOutput?: string;
    secret?: string;
    url?: string;
    mode?: string;
    outfile?: string;
    outfileType?: string;
    client: string;
    send?: Function;
    hash?: Function;
    verbose?: boolean;
    quiet?: boolean;
    addTypename?: boolean;
}
/**
 * Find `.graphql` files in `path`,
 * then prepare them & send them to the configured endpoint.
 *
 * @param {Object} options
 * @param {String} options.path - A glob to recursively search for `.graphql` files (Default is `./`)
 * @param {String} options.relayPersistedOutput - A path to a `.json` file from `relay-compiler`'s  `--persist-output` option
 * @param {String} options.secret - HMAC-SHA256 key which must match the server secret (default is no encryption)
 * @param {String} options.url - Target URL for sending prepared queries. If omitted, then an outfile is generated without sending operations to the server.
 * @param {String} options.mode - If `"file"`, treat each file separately. If `"project"`, concatenate all files and extract each operation. If `"relay"`, treat it as relay-compiler output
 * @param {Boolean} options.addTypename - Indicates if the "__typename" field are automatically added to your queries
 * @param {String} options.outfile - Where the generated code should be written
 * @param {String} options.outfileType - The type of the generated code (i.e., json, js)
 * @param {String} options.client - the Client ID that these operations belong to
 * @param {Function} options.send - A function for sending the payload to the server, with the signature `options.send(payload)`. (Default is an HTTP `POST` request)
 * @param {Function} options.hash - A custom hash function for query strings with the signature `options.hash(string) => digest` (Default is `md5(string) => digest`)
 * @param {Boolean} options.verbose - If true, log debug output
 * @return {Promise} Rejects with an Error or String if something goes wrong. Resolves with the operation payload if successful.
*/
declare function sync(options: SyncOptions): Promise<{
    operations: ClientOperation[];
}>;
export default sync;
