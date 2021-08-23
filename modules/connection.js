'use strict';
const uuidv4 = require('uuid').v4;
const { store } = require("./store");
const directMessage = require("./directMessage");
const multiplex = require('multiplex');
const { connections } = require("./nedb");
const EventEmitter = require("./eventEmitter");
const { EncodeStream, DecodeStream } = require("./streams");

const FilesController = require("./controllers/files"); // move to dir
const RequestsController = require("./controllers/requests");

const { Readable } = require('stream'); // test

var connection = {
    peers: {},
	online: [],

	encodedStream: null,
	decodedStream: null,

	highWaterMark: 8,

    accept: (socket) => {
        const connectionId = socket.dogma.id;
        const key = socket.dogma.hash;
        var address = socket.dogma.address; 

        if (key == store.node.hash) { 
            address = address.replace(address.split(":")[1], store.config.router); // change to regular expressions
			console.info("SELF CONNECTED", address);
            // socket.destroy(); // temp
        }
		const params = {
			connection_id: connectionId, 
			device_id: key, 
			address
		};

		const errorHandler = (socket, err) => { // edit !!! // add duplicates resolving
			if (socket.dogma.hash == store.node.hash) return console.info("skip self connection");
			console.log("DESTROY SOCKET", socket.dogma.address, socket.dogma.id, err.errorType);
			return socket.destroy(); // check system // need


            // if (!socket._tlsOptions.isServer) { // edit
            //     await _temp._query("UPDATE temp SET address = ? WHERE device_id = ?", [address, key]).then(() => {
            //         // console.log("successfully updated connection", [address, key]);
            //     }).catch(error => {
            //         console.error("can't update connection");
			// 	})
			// } 
			// console.log("DESTROY SOCKET", address, connectionId);
			// socket.destroy(); // check // edit // !!!
		}

		connection._online(key);
		connections.insert(params, (err, _result) => {
			if (err) return errorHandler(socket, err);
			// console.log("RES IC", _result);
		});

    },

    onConnect: (socket, address) => { 
        const connectionId = uuidv4(); // switch to random generator
        console.log("CONNECTION ESTABLISHED", connectionId, address); 

		socket.dogmaPlex = multiplex(function onStream(stream, id) {
			stream.on('data', (data) => { 
				console.log("got", data.length, "bytes in subchannel #", id);
				id = Number(id);
				switch (id) {
	
					// text
					case 0: // control
						const request = JSON.parse(data.toString());
						RequestsController({ 
							device_id: socket.dogma.hash,
							request
						});
					break;
					case 1: // messages
						directMessage.commit(socket.dogma.hash, data.toString(), 1, 0);
					break;
					case 3:	// attachments // rename
						const message = JSON.parse(data.toString()); // edit try catch
						directMessage.commit(socket.dogma.hash, message.items, 1, message.format);
					break;
	
					// streams
					case 2: // files
	
						const tempStream = Readable.from(data);
						const decoder = new DecodeStream({ highWaterMark: connection.highWaterMark });
						decoder.on("error", (err) => console.error("stream decode error", err));
						decoder.on("data", (decodedData) => {
							const descriptor = decoder.descriptor.readUInt16BE(0);
							FilesController.handleFile(descriptor, decodedData);
							console.log("Dec data", descriptor, decodedData);
						});
						tempStream.pipe(decoder);
						
					break;
	
					default:
						console.warn("Unknown substream type", id);
					break;
				}			
			});
			stream.on('end', () => { 
				stream.resume();
				console.log('There will be no more data.', 'net stream end');
			});
		});

		socket.multiplex = {};
		socket.multiplex.control = socket.dogmaPlex.createStream(0);
		socket.multiplex.messages = socket.dogmaPlex.createStream(1);
		socket.multiplex.files = socket.dogmaPlex.createStream(2);
		socket.multiplex.attachments = socket.dogmaPlex.createStream(3);

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

    onClose: (socket) => { 
		// const params = [
		//     socket.dogma.id,
		//     store.node.hash // wtf????
		// ];
		// add condition AND device_id != current_node_hash
		if (!socket.dogma) return console.info("closed socket with unknown attr");
		try {
			connection._offline(socket.dogma.hash);
			connections.remove({ connection_id: socket.dogma.id }, { }, (err, _count) => {
				if (err) return console.error("can't delete connection", err);
				console.log("successfully deleted connection", socket.dogma.id);
			});
		} catch (err) {
			console.error("connection onClose::", err);
		}
    }, 

	/**
	 * 
	 * @param {String} device_id
	 */
	getConnIdByDeviceId: (device_id) => {
		return new Promise((resolve, reject) => {
			connections.findOne({ device_id }, (err, result) => {
				if (err) return reject(err);
				resolve(result);
			})
		});
	},

	/**
	 * 
	 * @param {String} deviceId node device id
	 * @param {Object} message id, text
	 * @returns {Object} id,code,message
	 */
	sendToNode: async (deviceId, message) => { // edit // add read status message
		const response = (id, code, message) => { // edit
			var res = { id, code };
			if (message) res.message = message;
			return res;
		}
		try {
			const result = await connection.getConnIdByDeviceId(deviceId);
			if (!result) return response(message.id, 0); // edit try catch
			const cid = result.connection_id;
			const socket = connection.peers[cid];

			/** text */
			if (message.text && message.text.length) {
				const messageFormat = 0;
				directMessage.commit(deviceId, message.text, 0, messageFormat);
				socket.multiplex.messages.write(message.text);
			}

			/** files */
			if (message.files && message.files.length) {
				const fileFormat = 1;
				directMessage.commit(deviceId, message.files, 0, fileFormat);
				message.files.forEach(( file ) => {
					FilesController.permitFileTransfer(deviceId, file).then((_result) => {
						console.log("File transfer allowed", file.descriptor);
					}).catch((err) => {
						console.error("can't permit file transfer", err);
					})
				});
				socket.multiplex.attachments.write(JSON.stringify({
					format: fileFormat,
					items: message.files
				}));
			}


			return response(message.id, 1);
		} catch (err) {
			console.error("SEND TO NODE::", err);
			return response(message.id, -1, "can't send message"); // edit text
		}
	},

	/**
	 * 
	 * @param {String} deviceId node device id
	 * @param {Object} request type, action, [data]
	 * @returns {Object} id,code,message
	 */
	 sendRequestToNode: async (deviceId, request) => { 
		const response = (id, code, message) => { // edit
			var res = { id, code };
			if (message) res.message = message;
			return res;
		}
		try {
			const result = await connection.getConnIdByDeviceId(deviceId);
			if (!result) return response(-1, 0, "user is offline"); // edit try catch
			const cid = result.connection_id;
			const socket = connection.peers[cid];
			socket.multiplex.control.write(JSON.stringify(request));			
		} catch (err) { 
			console.error("SEND TO NODE::", err);
			return response(-1, -1, "can't send request"); // edit text		
		}
	},

	/**
	 * 
	 * @param {String} deviceId 
	 * @param {Object} readable Readable stream
	 * @param {Number} descriptor transfer descriptor
	 * @returns 
	 */
	streamToNode: async (deviceId, readable, descriptor) => { // edit
		try {
			const result = await connection.getConnIdByDeviceId(deviceId);
			if (!result) return console.warn("connection id didn't find", deviceId); // edit try catch
			const socket = connection.peers[result.connection_id];
			const encoder = new EncodeStream({ highWaterMark: connection.highWaterMark, descriptor });
			encoder.on("error", (err) => console.error("stream encode error", err));
			readable.pipe(encoder).pipe(socket.multiplex.files, { end: false });
		} catch (err) {
			console.error("stream to node error::", err);
		}
	},

	/**
	 * 
	 * @param {String} hash node id
	 */
	_online(hash) {
		console.log("ONLINE", hash);
		connection.online.push(hash);
		EventEmitter.emit("friends", true); // edit
	},

	/**
	 * 
	 * @param {String} hash node id
	 */
	_offline(hash) {
		const index = connection.online.indexOf(hash);
		if (index !== -1) { 
			console.log("OFFLINE", hash);
			connection.online.splice(index, 1);
			EventEmitter.emit("friends", true); // edit
		}
	},

	sendToUser: (hash, message) => {
		
	},

	sendToGroup: (hash, message) => {
		
	}

}

EventEmitter.on("file-buffer-complete", (payload) => {
	console.log("PL", payload);
})
EventEmitter.on("send-file", (payload) => {
	// console.log("send file", payload);
	const { device_id, stream, descriptor } = payload;
	connection.streamToNode(device_id, stream, descriptor);
})

module.exports = connection;