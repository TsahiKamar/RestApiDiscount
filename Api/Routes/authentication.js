
const express = require('express');
const router = express.Router();
let users = require('../users.json');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

/* Login */
//https://localhost:443/authentication/login
router.post('/login',(req,res,next) => {  

  console.log('Login  ..');

  let User = users.find(item=>item.username==req.body.username);
   
  if (User == undefined)
  {
    res.cookie("jwt",null, { maxAge: '0',secure: true, httpOnly: true}) //secure = https 
     return res.status(401).json({
        //message : 'User Unauthorize !'    
   });
 
  } 
  console.log('found User' + JSON.stringify(User));
 
  let username = req.body.username
  let password = req.body.password
  
  if (!username || !password || User.password !== password){

       return res.status(401).send()
  }

  let payload = {username: username}

  //create the access token with the shorter lifespan
  let accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
      algorithm: "HS256",
      expiresIn: process.env.ACCESS_TOKEN_LIFE,
       
  })
 
  //create the refresh token with the longer lifespan
  let refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
      algorithm: "HS256",
      expiresIn: process.env.REFRESH_TOKEN_LIFE
  })

  //store the refresh token in the user array
  //NOT IMPLEMENTED users[username].refreshToken = refreshToken
  
  res.cookie("jwt", accessToken, { maxAge: process.env.ACCESS_TOKEN_LIFE,secure: true, httpOnly: true}) //secure = https
  

  res.send()

});

module.exports = router;

