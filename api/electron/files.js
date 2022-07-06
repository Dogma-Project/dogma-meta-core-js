const { dialog } = require("electron");
const fsPromises = require('fs').promises;
const path = require("path");

function FilesHandler() {

	this._handle("files_select", async (_data) => {
		try {
			const { canceled, filePaths } = await dialog.showOpenDialog({ properties: ['openFile', 'multiSelections'] });
			if (canceled || !filePaths.length) return Promise.resolve(null);
			let result = []
			for (let i = 0; i < filePaths.length; i++) {
				const filePath = filePaths[i];
				const { size } = await fsPromises.stat(filePath);
				const name = path.basename(filePath);
				result.push({
					name,
					size,
					type: "unknown", // edit
					pathname: filePath
				});
			}
			return Promise.resolve(result);
		} catch (err) {
			console.error("electron files api error", err);
			return Promise.reject(null);
		}

	});


}

module.exports = FilesHandler;