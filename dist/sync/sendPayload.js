"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var http_1 = __importDefault(require("http"));
var https_1 = __importDefault(require("https"));
var url_1 = __importDefault(require("url"));
var crypto_1 = __importDefault(require("crypto"));
/**
 * Use HTTP POST to send this payload to the endpoint.
 *
 * Override this function with `options.send` to use custom auth.
 *
 * @private
 * @param {Object} payload - JS object to be posted as form data
 * @param {String} options.url - Target URL
 * @param {String} options.secret - (optional) used for HMAC header if provided
 * @param {String} options.client - (optional) used for HMAC header if provided
 * @param {Boolean} options.verbose - (optional) if true, print extra info for debugging
 * @return {Promise}
*/
function sendPayload(payload, options) {
    var syncUrl = options.url;
    var key = options.secret;
    var clientName = options.client;
    var verbose = options.verbose;
    // Prepare JS object as form data
    var postData = JSON.stringify(payload);
    // Get parts of URL for request options
    var parsedURL = url_1.default.parse(syncUrl);
    // Prep options for HTTP request
    var defaultHeaders = {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData).toString()
    };
    var httpOptions = {
        protocol: parsedURL.protocol,
        hostname: parsedURL.hostname,
        port: parsedURL.port,
        path: parsedURL.path,
        auth: parsedURL.auth,
        method: 'POST',
        headers: defaultHeaders,
    };
    // If an auth key was provided, add a HMAC header
    var authDigest = null;
    if (key) {
        authDigest = crypto_1.default.createHmac('sha256', key)
            .update(postData)
            .digest('hex');
        var header = "GraphQL::Pro " + clientName + " " + authDigest;
        if (verbose) {
            console.log("[Sync] Header: ", header);
            console.log("[Sync] Data:", postData);
        }
        httpOptions.headers["Authorization"] = header;
    }
    var httpClient = parsedURL.protocol === "https:" ? https_1.default : http_1.default;
    var promise = new Promise(function (resolve, reject) {
        // Make the request,
        // hook up response handler
        var req = httpClient.request(httpOptions, function (res) {
            res.setEncoding('utf8');
            // Gather the response from the server
            var body = "";
            res.on('data', function (chunk) {
                body += chunk;
            });
            res.on("end", function () {
                if (verbose) {
                    console.log("[Sync] Response Headers: ", res.headers);
                    console.log("[Sync] Response Body: ", body);
                }
                var status = res.statusCode;
                // 422 gets special treatment because
                // the body has error messages
                if (status && status > 299 && status != 422) {
                    reject("  Server responded with " + res.statusCode);
                }
                else {
                    resolve(body);
                }
            });
        });
        req.on('error', function (e) {
            reject(e);
        });
        // Send the data, fire the request
        req.write(postData);
        req.end();
    });
    return promise;
}
exports.default = sendPayload;
