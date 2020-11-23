interface SendPayloadOptions {
    url: string;
    secret?: string;
    client?: string;
    verbose?: boolean;
}
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
declare function sendPayload(payload: any, options: SendPayloadOptions): Promise<unknown>;
export default sendPayload;
