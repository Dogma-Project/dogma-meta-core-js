import { File } from "../model";
import * as Types from "../../types";
/** @module FilesController */
declare const files: {
    sendChunksize: number;
    write: {};
    downloadProgress: {};
    uploadProgress: {};
    /**
     *
     * @param {Object} params
     * @param {String} params.to
     * @param {Number} params.type
     * @param {Number} params.descriptor check
     * @param {String} params.title
     * @param {Number} params.size check
     */
    permitFileDownload({ to, type, descriptor, title, size }: {
        to: any;
        type: any;
        descriptor: any;
        title: any;
        size: any;
    }): Promise<unknown>;
    permitFileTransfer(user_id: Types.User.Id, file: Types.File.Description): Promise<{
        descriptor: string;
        pathname: string;
    }>;
    forbidFileUpload(descriptor: number): void;
    sendFile(user_id: Types.User.Id, node_id: Types.Node.Id, descriptor: number): Promise<any>;
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
    handleRequest(user_id: Types.User.Id, node_id: Types.Node.Id, request: object): any;
    /**
     *
     * @param {Object} params
     * @param {Number} params.descriptor
     * @param {Buffer} params.decodedData check
     * @param {String} params.node_id
     * @param {String} params.user_id
     */
    handleFile({ descriptor, decodedData, node_id, user_id }: {
        descriptor: any;
        decodedData: any;
        node_id: any;
        user_id: any;
    }): any;
    /**
     *
     * @returns {String} descriptor size:15
     */
    getFileDescriptor(): string;
};
export default files;
