export let sendChunksize: number;
export let write: {};
export let downloadProgress: {};
export let uploadProgress: {};
/**
 *
 * @param {Object} params
 * @param {String} params.to
 * @param {Number} params.type
 * @param {Number} params.descriptor check
 * @param {String} params.title
 * @param {Number} params.size check
 */
export function permitFileDownload({ to, type, descriptor, title, size }: {
    to: string;
    type: number;
    descriptor: number;
    title: string;
    size: number;
}): Promise<any>;
/**
 *
 * @param {Object} params
 * @param {String} user_id
 * @param {Object} file
 * @param {String} file.name
 * @param {Number} file.size
 * @param {String} file.type
 * @param {String} file.pathname optional
 * @param {String} file.data optional
 * @returns {Promise}
 */
export function permitFileTransfer({ user_id, file }: Object): Promise<any>;
export function forbidFileUpload({ descriptor }: {
    descriptor: any;
}): void;
/**
 *
 * @param {Object} params
 * @param {String} params.node_id
 * @param {String} params.user_id
 * @param {Number} params.descriptor
 */
export function sendFile({ node_id, user_id, descriptor }: {
    node_id: string;
    user_id: string;
    descriptor: number;
}): Promise<any>;
/**
 *
* @param {Object} params
* @param {String} params.node_id
* @param {String} params.user_id
* @param {Object} params.request
* @param {String} params.request.type
* @param {String} params.request.action
* @param {Object} params.request.data
 */
export function handleRequest({ node_id, user_id, request }: {
    node_id: string;
    user_id: string;
    request: {
        type: string;
        action: string;
        data: Object;
    };
}): any;
/**
 *
 * @param {Object} params
 * @param {Number} params.descriptor
 * @param {Buffer} params.decodedData check
 * @param {String} params.node_id
 * @param {String} params.user_id
 */
export function handleFile({ descriptor, decodedData, node_id, user_id }: {
    descriptor: number;
    decodedData: Buffer;
    node_id: string;
    user_id: string;
}): any;
/**
 *
 * @returns {String} descriptor size:15
 */
export function getFileDescriptor(): string;
