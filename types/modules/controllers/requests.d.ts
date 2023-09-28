export = RequestsController;
/** @module RequestsController */
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
declare function RequestsController({ node_id, user_id, request }: {
    node_id: string;
    user_id: string;
    request: {
        type: string;
        action: string;
        data: Object;
    };
}): any;
