"use strict";
const net = require('net');
const sget = require('sget');

const IP = sget("IP: ");
const PORT = sget("Port: ");

const stdin = process.openStdin();
const client = net.connect(parseInt(PORT, 10), IP.trim(), () => {
  // 'connect' listener
  console.log('connected to server!');
  client.write('Hello world!\r\n');  // send data to server
});
// receive data from server
client.on('data', (data) => {
  console.log("Server said: " + data.toString());
});
// when client disconnected
client.on('end', () => {
  console.log('disconnected from server');
  stdin.removeListener('data', stdinDataListener);  // unsubscribe
  stdin.destroy();  // close stdin
});
const stdinDataListener = function(data) {
    let str = data.toString().trim();
    console.log("You entered: " + str);
    if (str === "exit") {
            client.end();  // disconnect client from server
    } else {
            client.write(str);  // send input string to server
    }
};
stdin.addListener('data', stdinDataListener);
