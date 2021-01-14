const net = require('net');
const fs = require('fs');
const { stdin } = require('process');
const conn = net.createConnection({
  host:'localhost',
  port: 3000
});
const nonDataMsg = [
  'please enter a file to request: ',
  'please enter a valid file that can be fetched from the server',
  'fetching file...',
  '...fetching complete'
];

conn.setEncoding('utf8');
stdin.setEncoding('utf8');

conn.on('data', (data)=>{
  //need a better way to differentiate betweeen writing data vs non
  if(nonDataMsg.includes(data)) console.log(data);
  if(data.includes('fetching file...')){
    writeFile(path, conn);
  }
})

stdin.on('data', input =>{
  conn.write(input);
  path = './clientfiles/' + input.slice(0, -1);
})

let path;
const writeFile = (path, conn) => {
  let ostream = fs.createWriteStream(path);
  let date = new Date();
  let size = 0;
  let elapsed;
  
  conn.on('data', chunk => {
    if(!nonDataMsg.includes(chunk)){
      size += chunk.length;
      elapsed = new Date() - date;
      process.stdout.write(`\r${(size / (1024 * 1024)).toFixed(2)} MB of data was sent. Total elapsed time is ${elapsed / 1000} s\n`);
      ostream.write(chunk);
    }
  })
};

conn.on('end', () => {
  process.exit()
});