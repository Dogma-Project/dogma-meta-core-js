const { ifport } = require("./modules/arguments");
const Server = require("./api/socket.io/index");
const { init } = require("./index");

const { ee, api } = init();
const server = new Server();
server.subscribe(ee, api);

const options = { /* ... */ };
const io = require("socket.io")(options);

io.on("connection", (socket) => {
    server.init(socket);
});

io.listen(ifport);