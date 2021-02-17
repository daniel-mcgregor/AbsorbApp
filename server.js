const bodyParser = require('body-parser');
const cors = require('cors');
const errorhandler = require('errorhandler');
const express = require('express');
var mysql = require('mysql');

var db = mysql.createConnection({
  host: "localhost",
  user: "dantheman",
  password: "withaplan",
  database: 'absorbdatabase',
  insecureAuth : true
});

db.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});

const apiRouter = require('./api/api');

const app = express();
const PORT = process.env.PORT || 4001;

app.use(bodyParser.json());
app.use(cors());

app.use('/api', apiRouter);

app.use(errorhandler());

app.listen(PORT, () => {
  console.log('Listening on port: ' + PORT);
});

module.exports = app;