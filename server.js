const bodyParser = require('body-parser');
const cors = require('cors');
const errorhandler = require('errorhandler');
const express = require('express');
var mysql = require('mysql');

const cookieParser = require('cookie-parser');
const session = require('express-session');

const apiRouter = require('./api/api');

const app = express();
const PORT = process.env.PORT || 4001;

app.use(cors({
  origin: ["http://localhost:3000"],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use(session({
  key: "userId",
  secret: "osiefw3r8923rskdfn",
  resave: false,
  saveUninitialized: false,
  cookie: {
    expires: 86400000
  },
}));

app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Credentials', true);
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-  Override, Content-Type, Accept');
  next();
});


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


app.use('/api', apiRouter);

app.use(errorhandler());

app.listen(PORT, () => {
  console.log('Listening on port: ' + PORT);
});

module.exports = app;