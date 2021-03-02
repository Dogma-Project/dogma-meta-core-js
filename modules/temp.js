'use strict';
const sqlite3 = require('sqlite3').verbose(); // edit

global.temp = {};
global.temp.connection = false;

global.temp.open = () => {
    global.temp.connection = new sqlite3.Database(':memory:', (err) => {
        if (err) { 
            console.error("CRITICAL:: failed to init inmemory db: " + err.message);
        } else { 
            global.temp.connection.run(`CREATE TABLE "temp" (
                connection_id TEXT,
                device_id TEXT UNIQUE,
                address TEXT UNIQUE,
                CONSTRAINT temp_PK PRIMARY KEY (device_id)
            )`, (err) => { 
                if (err) console.error("CRITICAL:: failer to create inmemory db (temp): " + err.message); 
			});
			
            global.temp.connection.run(`CREATE TABLE "dm" (
                device_id TEXT,
                message TEXT,
				type INTEGER,
				time INTEGER
            )`, (err) => { 
                if (err) console.error("CRITICAL:: failer to create inmemory db (dm): " + err.message); 
            });
        }
    });
}

global.temp.query = (query, params) => {
    params = params || []; // check
    return new Promise((resolve, reject) => {
        global.temp.connection.run(query, params, (err) => {
            if (err) { 
                reject(err.message)
            } else {
                resolve(true)
            }   
        });
    }); 
}

global.temp.all = (query, params) => {
	params = params || {};
    return new Promise((resolve, reject) => {
		// global.temp.connection.all(query, params).then(resolve).catch(reject);
        return global.temp.connection.all(query, params, (err, rows) => {
            if(err) reject("Read error: " + err.message)
            else {
                resolve(rows)
            }
        })
    }) 
}

global.temp.get = (query, params) => {
    return new Promise((resolve, reject) => {
        global.temp.connection.get(query, params, function(err, row)  {
            if(err) reject("Read error: " + err.message)
            else {
                resolve(row)
            }
        })
    }) 
}

global.temp.open();