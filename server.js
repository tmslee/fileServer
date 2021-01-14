const net = require('net');
const fs = require('fs');

const server = net.createServer();

server.listen(3000, ()=>{
  console.log('file server Online @ port 3000');
})

server.on('connection', (client)=>{
  console.log('client connected');
  client.write('please enter a file to request: ');

  client.setEncoding('utf8');
  client.on('data', data => {
    data = './serverfiles/' + data.slice(0, -1);
    if(fs.existsSync(data)){
      client.write('fetching file...');
      getFile(data, client);
    }
    else{
      client.write('please enter a valid file that can be fetched from the server');
    }
  });
})

const getFile = (path, client) => {
  let istream = fs.createReadStream(path);
  client.pipe(process.stdout);

  istream.on('readable', function(){
    let data;
    while(data = this.read()) client.write(data);
  });

  istream.on('end', () => {
    client.end();
    //client.write('...fetching complete');
    //client.write('please enter a file to request: ')
  });
}