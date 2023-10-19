/** @module Messages */
declare const messages: {
    /**
     *
     * @param {Object} params
     * @param {String} params.id
     * @param {String} params.text
     * @param {Array} params.files
     * @param {Number} params.direction
     * @param {Number} params.format
     * @param {Number} params.type
     */
    commit: ({ id, text, files, direction, format, type }: {
        id: any;
        text: any;
        files: any;
        direction: any;
        format: any;
        type: any;
    }) => Promise<string>;
};
export default messages;
