'use strict'
const net = require('net');
const fs = require('fs-extra');
const cakes = fs.readJsonSync('./cakes.json');
const clients = []

const server = net.createServer((connection) => {
  console.log('client %s:%s connected', connection.remoteAddress,
    connection.remotePort);
  clients.push(connection);

  connection.on('data', (data) => {
    const req = String(data).split(' ');

    if (req.length === 1) {
      switch (req[0]) {
        case 'cakes':
          connection.write(JSON.stringify(cakes['cakes'], null, 4));
          console.log(JSON.stringify(cakes['cakes'], null, 4));
          break;
        case 'size':
          connection.write(cakes['cakes'].length.toString());
          console.log(cakes['cakes'].length.toString());
          break;
        case 'clients':
          clients.forEach((client, i, arr) => {
            connection.write(`client #${i}: ${client.remoteAddress}:
              ${client.remotePort}`);
            console.log(`client #${i}: ${client.remoteAddress}:
              ${client.remotePort}`);
          });
          break;
        default:
          connection.write('Client entered');
          console.log('Client entered');
      }
    }
    if (req.length === 3){
      if (req[0] === 'FindCakeBy'){
        let value;
        const filter = req[1];

        if (filter === 'rating' || filter === 'weight') {
          value = parseInt(req[2]);
        } else {
          value = req[2];
        }

        const result = [];
        for (let i = 0; i < cakes['cakes'].length; ++i) {
          if (cakes['cakes'][i][filter] === value) {
            result.push(cakes['cakes'][i]);
          }
        }
        if (result.length === 0) {
          connection.write('There is no cake with such options');
          console.log('There is no cake with such options');
        } else {
          result.forEach((cake, i ,arr) => {
            connection.write(JSON.stringify(cake, null, 4));
            console.log(JSON.stringify(cake, null, 4));
          });
        }
      } else {
         connection.write('There is no such command.');
         console.log('There is no such command.');
      }
    }
    console.log(req);
  });

  connection.on('end', () => {
    const index = clients.indexOf(connection);
    if (index !== -1) {
      clients.splice(index, 1);
    }
    console.log('client disconnected');
  });

  connection.write('Hello World!\r\n');

  connection.pipe(connection);
});

server.listen(8080, function() {
  console.log('server is listening on port 8080');
});