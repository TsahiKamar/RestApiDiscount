
require('dotenv').config();
const cookieParser = require('cookie-parser');

const express = require('express');

const app = express();


// const openssl = require('openssl-nodejs');
// var buffer = Buffer.alloc(8);
// openssl(['req', '-config', 'csr.conf', '-out', 'CSR.csr', '-new', '-newkey', 'rsa:2048', '-nodes', '-keyout', 'privateKey.key'], function (err, buffer) {
//   console.log(err.toString(), buffer.toString());
//   });

const jwt =require('jsonwebtoken');

const morgan = require('morgan');

//Routes
const authRoutes = require('./Api/Routes/authentication');
const customersRoutes = require('./Api/Routes/customers');


//const {login, refresh} = require('./Api/Controllers/controller');//?MY //require('./authentication'); //???

const bodyParser = require('body-parser');
//const { Console } = require('console');


app.use(cookieParser())
//? NEW JWT
//app.post('/refrsh', refresh) 

app.use(morgan("dev"));

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());


app.use((req,res,next) => {
  res.header("Access-Control-Allow-Origin","*");
  res.header("Access-Control-Allow-Headers","*");
 
 if (req.method === "OPTIONS") {
   res.header("Access-Control-Allow-Methods","PUT, POST, PATCH, DELETE, GET");
   return res.status(200).json({});
 }
 next();
});

//Routes
app.use('/authentication',authRoutes);

//Verify Client Token
app.get('/customers',verify,customersRoutes);
app.get('/customers/customer/:id',verify,customersRoutes);
app.delete('/customers/delete/:id',verify,customersRoutes);
app.get('/customers/NewCustomer',verify,customersRoutes);
app.delete('/customers/update/:id',verify,customersRoutes);


app.use('/customers',customersRoutes);
app.use('/customers/customer/:id',customersRoutes);
app.use('/customers/delete/:id',customersRoutes);
app.use('/customers/NewCustomer',customersRoutes);
app.use('/customers/update/:id',customersRoutes);

app.use((req, res,next) => {
    const error = new Error('Not found !');
    error.status= 404;
    next(error);    
});

//Errors ..
app.use((error,req, res,next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        } 
    });
    //const error = new Error('Not found !');
    //error.status(404);
    //next(error);    
});


function verify (req, res, next){
  console.log('Verify token .. ');
  console.log('req : ' + JSON.stringify(req.cookies.jwt));

  let accessToken = req.cookies.jwt

  //if there is no token stored in cookies, the request is unauthorized
  if (!accessToken){
      return res.status(403).send()
  }
  let payload
  try{
      //use the jwt.verify method to verify the access token
      //throws an error if the token has expired or has a invalid signature
      payload = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET)
      next()     
  }
  catch(e){
      //if an error occured return request unauthorized error
      return res.status(401).send(e)
  }
}

module.exports = app;