/**
 *
 * @param {Object} params
 * @param {String} params.user_id
 * @param {Object} params.file file description
 * @param {String} params.file.descriptor
 * @param {Number} params.file.size
 * @param {String} params.file.pathname
 */
export function permitFileTransfer({ user_id, file }: {
    user_id: string;
    file: {
        descriptor: string;
        size: number;
        pathname: string;
    };
}): Promise<any>;
/**
 *
 * @param {Object} params
 * @param {String} params.user_id
 * @param {Number} params.descriptor
 */
export function forbidFileTransfer({ user_id, descriptor }: {
    user_id: string;
    descriptor: number;
}): Promise<any>;
/**
 *
 * @param {Object} params
 * @param {String} params.user_id
 * @param {Number} params.descriptor
 */
export function fileTransferAllowed({ user_id, descriptor }: {
    user_id: string;
    descriptor: number;
}): Promise<any>;
