/*var net = require('net');
const sget = require('sget');
const PORT = sget("Port: ");
*/
var jsonfile  = require ('jsonfile');

var file = 'objects.json'

jsonfile.readFile (file, function(err, obj){
    console.dir(obj);
})

jsonfile.
//data = '[{"name": "BLAfbg", "age":"12"},{"name":"hfgkrb", "age":"64"}]'
/*var server = net.createServer(function(connection) {
   console.log('client %s:%s connected', connection.remoteAddress, connection.remotePort);

   // https://nodejs.org/api/net.html#net_event_data
   connection.on("data", data => {
          // receive message from client
          console.log("Client said : " + String(data));
          connection.write('On data response!\r\n');  // send message to client
   });

   connection.on('end', function() {
          console.log('client disconnected');
   });

   connection.write('Hello World!\r\n');  // send message to client

   connection.pipe(connection);
});
server.listen(parseInt(PORT, 10), function() {
  console.log('server is listening');
});
*/
/*var mydata = JSON.parse(data);
 console.log(data[4].name);
 console.log(data[4].surname);
 console.log(data[2].name);
 console.log(data[1].surname);


const data = require ('/Users/blackstee/Documents/Web-прога/webprogbase/labs/lab1/objects.json');

var mydata = JSON.parse(data);
 console.log(mydata[4].name);
 console.log(mydata[4].surname);
 console.log(mydata[2].name);
 console.log(mydata[1].surname);

var file = require ("objects.json");
var json = file.getJSON("objects.json", function(json) {
    console.log(json); // this will show the info it in firebug console
});
//const readline = require('readline');


/*const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});
*/


/*rl.question('это та неконтролируемая штука', (answer) => {
  console.log('Ответ:', answer);
  rl.close();
});*/
