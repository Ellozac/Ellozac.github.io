const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sqlite = require('sqlite3')
const app = express();
require("dotenv").config();
const passHash = process.env.PASSHASH;
const secret_key = process.env.SECRET_KEY;
var port = 8081
// let db = new sqlite.Database('./database.sqlite');
// db.run("CREATE TABLE IF NOT EXISTS flights (id INTEGER PRIMARYKEY AUTO INCREMENT);");

app.use(express.static('./public'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// POST route for "/devLog"
app.post('/devLog', (req, res) => {
   // Retrieve the username and password from the request body
   const { username, password } = req.body;

   // Perform authentication or any other necessa ry logic
   // Here, for demonstration purposes, we're simply checking if the username and password match a predefined value
   bcrypt.compare(password, passHash, (err, outcome) => {
      if (outcome && username == "QJZ") {
         const token = jwt.sign({ username }, secret_key, { expiresIn: '1h' });

         // Send the token in the response
         res.json({ token });
      } else {
         res.status(401).json({ error: 'Invalid username or password' });
      }
   });
});

app.post('/validateToken', (req, res) => {
   const token = req.headers.authorization?.split(' ')[1];
 
   // Check if the token exists
   if (!token) {
     return res.status(401).json({ valid: false });
   }
 
   try {
     // Verify the token
     jwt.verify(token, secret_key, (err, decoded) => {
       if (err) {
         // Token verification failed
         return res.status(401).json({ valid: false });
       } else {
         // Token is valid
         return res.json({ valid: true });
       }
     });
   } catch (error) {
     // Error occurred during token verification
     return res.status(500).json({ error: 'Internal server error' });
   }
 });

// allows on run of server to specify a spicfic port.
process.argv.forEach(function (val, index, array) {
  if (val === "--port") {
    try {
      const re = /^\d*$/;
      if (re.test(array.at((index + 1)))) {
        port = Number(array.at((index + 1)));
        console.log("setting the port to ", port);
      } else {throw new TypeError("not a number")};
    } catch (e) {
      console.error(e, "ERROR ACCORED the --port was not set correctly --port <port>");
    };
  };
});

var server = app.listen(port, function () {
   var host = server.address().address;
   var port = server.address().port;

   console.log("Website is here :) --> http://%s:%s", host, port);
});
