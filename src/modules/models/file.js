const { fileTransfer: fileTransferDb } = require("../nedb");

const model = module.exports = {

    /**
     * 
     * @param {Object} params
     * @param {String} params.user_id
     * @param {Object} params.file file description
     * @param {String} params.file.descriptor
     * @param {Number} params.file.size
     * @param {String} params.file.pathname
     */
    async permitFileTransfer({ user_id, file }) {
        const { descriptor, size, pathname } = file;
        return fileTransferDb.updateAsync({
            user_id,
            descriptor
        }, {
            $set: {
                user_id,
                descriptor,
                size,
                pathname
            }
        }, {
            upsert: true
        });
    },

    /**
     * 
     * @param {Object} params
     * @param {String} params.user_id
     * @param {Number} params.descriptor
     */
    async forbidFileTransfer({ user_id, descriptor }) {
        return fileTransferDb.removeAsync({ user_id, descriptor }, { multi: true });
    },

    /**
     * 
     * @param {Object} params
     * @param {String} params.user_id 
     * @param {Number} params.descriptor
     */
    async fileTransferAllowed({ user_id, descriptor }) {
        return fileTransferDb.findOneAsync({ user_id, descriptor });
    }

}