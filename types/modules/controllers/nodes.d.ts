/**
    *
    * @param {Object} params
    * @param {String} params.node_id
    * @param {Object} params.request
    * @param {String} params.request.type
    * @param {String} params.request.action
    * @param {Object} params.request.data
*/
export function handleRequest({ node_id, request }: {
    node_id: string;
    request: {
        type: string;
        action: string;
        data: Object;
    };
}): Promise<any>;
