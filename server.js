
//self-signed certificate https
//npm install pem
//open ssl -  https://www.npmjs.com/package/openssl-nodejs
//npm install openssl-nodejs

//https://flaviocopes.com/express-https-self-signed-certificate/
//https://www.thepolyglotdeveloper.com/2018/11/create-self-signed-certificate-nodejs-macos/
//https://hackernoon.com/set-up-ssl-in-nodejs-and-express-using-openssl-f2529eab5bb
//PRIVATE KEY OK : openssl genrsa -out server.key 2048
//RESULTS :
//Generating RSA private key, 2048 bit long modulus
//.........................+++
//..........+++
//e is 65537 (0x10001)

//FQDN=localhost
//CERT OK : openssl req -new -x509 -key server.key -out server.cert -days 365

//OK
//openssl req -x509 -newkey rsa:4096 -keyout key.pem -out cert.pem -days 365

// FQDN : localhost
// NEW OK openssl req -nodes -new -x509 -keyout server.key -out server.cert

const http = require('http');
const app = require('./app'); 

//https - 443 : Should be run with sudo npm start
const HTTPS = require("https");
const fs = require("fs");


// HTTPS.createServer({
//   key: fs.readFileSync("server.key"),
//   cert: fs.readFileSync("server.cert")
// }, app).listen(443, () => {
//   console.log("Listening at port:443 ...");
// });

// ./
HTTPS.createServer({
  key: fs.readFileSync('key.pem'),
  cert: fs.readFileSync('cert.pem'),
  passphrase: '8170'
}, app).listen(443, () => {
  console.log("Listening at port:443 ...");
});




