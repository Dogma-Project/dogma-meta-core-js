'use strict';
const uuidv4 = require('uuid').v4;
const store = require("./store");
const directMessage = require("./directMessage");
const multiplex = require('multiplex');

var connection = {
    peers: {},
    accept: (socket) => {
        const connectionId = socket.dogma.id;
        const key = socket.dogma.hash;
        var address = socket.dogma.address; 

        if (key == store.node.hash) { 
            address = address.replace(address.split(":")[1], store.config.router); // change to regular expressions
			global.log.info("SELF CONNECTED", address);
            // socket.destroy(); // temp
        }
		const params = [connectionId, key, address];
        global.temp.query("INSERT INTO temp(connection_id,device_id,address) VALUES(?,?,?)", params).then(() => { 
            // console.log("SUCCESS", "INSERT INTO TEMP", params);
		}).catch(async (_err) => { // check if planned duplicate
			return; // test
			console.log("DESTROY SOCKET", address, connectionId);
			return socket.destroy(); // проверить работу системы
            if (!socket._tlsOptions.isServer) { // edit
                await global.temp.query("UPDATE temp SET address = ? WHERE device_id = ?", [address, key]).then(() => {
                    // console.log("successfully updated connection", [address, key]);
                }).catch(error => {
                    console.error("can't update connection");
				})
			} 
			console.log("DESTROY SOCKET", address, connectionId);
			socket.destroy(); // check // edit // !!!
        });
    },

    onConnect: (socket, address) => { 
        const connectionId = uuidv4(); // switch to random generator
        global.log.success("CONNECTION ESTABLISHED", connectionId, address); 

		socket.dogmaPlex = multiplex(function onStream(stream, id) {
			stream.on('data', function(data) { 
				id = Number(id);
				switch (id) {
					case 0:	// control

					break;
					case 1: // messages
						directMessage.commit(socket.dogma.hash, data.toString(), 1);
					break;
					default:
						console.warn("Unknown substream type", id);
					break;
				}
			})
		});
		socket.multiplex = {};
		socket.multiplex.control = socket.dogmaPlex.createStream(0);
		socket.multiplex.messages = socket.dogmaPlex.createStream(1);
		socket.multiplex.files = socket.dogmaPlex.createStream(2);
		// add more
		socket.dogmaPlex.pipe(socket);
		socket.pipe(socket.dogmaPlex);

        connection.peers[connectionId] = socket;
        if (socket.getCertificate) { 
			try {
				const indentity = socket.getCertificate();
				if (indentity.fingerprint256 !== store.node.hash) console.warn("Device IDs aren't equal", store.node.hash, indentity.fingerprint256);
			} catch (e) {
				console.error("socket.getCertificate::", e);
			}
        }
        const peerIdentity = socket.getPeerCertificate(true);
        socket.dogma = { 
            id: connectionId,
            address,
            hash: peerIdentity.fingerprint256 
        }
        connection.accept(socket);
    },

    onClose: async (socket) => { 
        try {
            // console.log("CONNECTION CLOSED", socket.dogma.id, socket.dogma.hash);
            const params = [
                socket.dogma.id,
                store.node.hash
            ];
			await global.temp.query("DELETE FROM temp WHERE connection_id = ? AND device_id != ?", params).then(() => { 
                // check
				console.log("successfully deleted connection", socket.dogma.id);
			}).catch(error => {
				console.error("can't delete connection", error);
			});
        } catch (e) {
            console.log("CONNECTION CLOSED WITH UNK ATTRIBUTE");
        }
    }, 

	/**
	 * 
	 * @param {String} deviceId node device id
	 * @param {Object} message id, text
	 * @returns {Object} id,code,message
	 */
	sendToNode: async (deviceId, message) => { // edit // add read status message
		const response = (id, code, message) => {
			var res = { id, code };
			if (message) res.message = message;
			return res;
		}
		try {
			console.log("SEND TO NODE", message);
			const result = await global.temp.get("SELECT connection_id AS cid FROM temp WHERE device_id = ?", [deviceId]);
			if (!result || !result.cid) return response(message.id, 0);
			const socket = connection.peers[result.cid];
			directMessage.commit(deviceId, message.text, 0); 
			console.log("WRITE TO STREAM", message.text);
			socket.multiplex.messages.write(message.text);
			return response(message.id, 1);
		} catch (err) {
			console.error("SEND TO NODE::", err);
			return response(message.id, -1, "can't send message"); // edit text
		}
	},

	sendToUser: (hash, message) => {
		
	},

	sendToGroup: (hash, message) => {
		
	}
}

module.exports = connection;