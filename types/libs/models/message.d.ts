declare const model: {
    getAll(type: number): Promise<any>;
    get({ id, since, type }: {
        id: string;
        since: number;
        type: number;
    }): Promise<any>;
    getStatus({ id, type }: {
        id: string;
        type: number;
    }): Promise<{
        text: any;
        from: any;
        newMessages: number;
    }>;
    /**
     *
     * @param {Object} params
     * @param {String} params.id
     * @param {String} params.message
     * @param {String} params.sync_id
     * @param {Number} params.direction
     * @param {Number} params.format
     * @param {Number} params.type
     */
    push(params: any): Promise<any>;
    /**
     *
     * @param {Array} data
     * @param {String} from node_id
     */
    sync(data: any, from: any): Promise<boolean>;
    /**
     *
     * @param {String} node_id
     * @returns
     */
    getSync(node_id: any): Promise<any>;
};
export default model;
