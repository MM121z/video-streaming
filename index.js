const WebSocket = require('ws');
const fs = require('fs');
const uuidv4 = require('uuid/v4');

const wss = new WebSocket.Server({ port: 7777 });

const clients = [];

const fileName = `test-${uuidv4()}.webm`;

const fStream = fs.createWriteStream(`./${fileName}`);

wss.on('connection', function connection(ws) {
    clients.push(ws);

    ws.on('message', function incoming(message) {
        for (let i = 0; i < clients.length; i++) {
            if(ws !== clients[i]) {
                clients[i].send(message);
            }
        }

        const buffer = new Buffer.from(message.buffer);

        fStream.write(buffer);
    });
});