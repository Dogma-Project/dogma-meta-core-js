const FilesController = require("./files");

const RequestsController = ({ device_id, request }) => {
	if ( !request || !request.type || !request.action ) return console.warn("unknown request");
	switch (request.type) {
		case "file":
			FilesController.handleRequest({ device_id, request });
		break;
		default:
			console.warn("unknown request type", request); // edit
		break;
	}
}

module.exports = RequestsController;