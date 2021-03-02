global.log = {};
global.log.success = (...args) => { 
    console.log("\x1b[32m")
    console.log(args);
    console.log("\x1b[0m");
}

global.log.error = (...args) => { 
    console.log("\x1b[31m")
    console.log(args);
    console.log("\x1b[0m");
}

global.log.info = (...args) => { 
    console.log("\x1b[34m")
    console.log(args);
    console.log("\x1b[0m");
}

global.log.warn = (...args) => { 
    console.log("\x1b[33m")
    console.log(args);
    console.log("\x1b[0m");
}