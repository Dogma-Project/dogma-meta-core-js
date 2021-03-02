// 'use strict';
const sqlite3 = require('sqlite3').verbose(); // edit
const homedir = require('os').homedir();

/* 
MOVE MODULE TO THE MODEL.JS 
*/

var db
exports.db = db;
exports.open = function() {
    const path = homedir + "/.dogma-node/data.db";
    return new Promise(function(resolve, reject) {
        this.db = new sqlite3.Database(path, sqlite3.OPEN_READWRITE, 
            (err) => { 
				// console.log("OPEN RESULT", err);
                if (err) reject(err)
                else    resolve("Database " + path + " opened.")
            }
        );
    })
}

// any query: insert/delete/update
exports.run = function(query, params) { // edit
	params = params || {};
    return new Promise(function(resolve, reject) {
        this.db.run(query, params, 
            function(err)  {
                if(err) reject(err.message)
                else    resolve(true)
        })
    })    
}

// first row read
exports.get=function(query, params) {
    return new Promise(function(resolve, reject) {
        this.db.get(query, params, function(err, row)  {
            if(err) reject("Read error: " + err.message)
            else {
                resolve(row)
            }
        })
    }) 
}

// set of rows read
exports.all=function(query, params) { 
	params = params || {};
    return new Promise(function(resolve, reject) {
        this.db.all(query, params, function(err, rows)  {
            if(err) reject("Read error: " + err.message)
            else {
                resolve(rows)
            }
        })
    }) 
}

// each row returned one by one 
exports.each=function(query, params, action) {
    return new Promise(function(resolve, reject) {
        var db = this.db
        db.serialize(function() {
            db.each(query, params, function(err, row)  {
                if(err) reject("Read error: " + err.message)
                else {
                    if(row) {
                        action(row)
                    }    
                }
            })
            db.get("", function(err, row)  {
                resolve(true)
            })            
        })
    }) 
}

exports.close=function() {
    return new Promise(function(resolve, reject) {
        this.db.close()
        resolve(true)
    }) 
}
