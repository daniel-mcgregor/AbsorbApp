
const express = require('express');
const usersRouter = express.Router();
const jwt = require('jsonwebtoken');
require("dotenv").config();
var mysql = require('mysql');
const bcrypt = require('bcryptjs');

const saltRounds = 10;

var db = mysql.createConnection({
  host: "eu-cdbr-west-03.cleardb.net",
  user: "b8edfe2bdc69ec",
  password: "9a66db9e",
  database: 'heroku_572f1c341b69525',
  insecureAuth : true
});

const verifyJWT = (req, res, next) => {
  const token = req.headers["x-access-token"];
  if (!token) {
    res.status(400);
  } else {
    jwt.verify(token, process.env.TOKEN_SECRET, (err, decoded) => {
      if (err) {
        res.status(400).json({auth: false, message: "authentication failed"});
      } else {
        req.userId = decoded.id;
        next();
      }
    });
  }
}



usersRouter.post('/', (req, res, next) => {

    const username = req.body.newUser.username;
    const email = req.body.newUser.email;
    const password = req.body.newUser.password;

    const sql = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';

    bcrypt.hash(password, saltRounds, (err, hash) => {

      if (err) {
        console.log(err)
      }

      db.query(sql, [username, email, hash], (error) => {
        if (error){
            next(error);
        }else {
            const sql2 = "SELECT * FROM users WHERE username = ?";
            const values2 = [username];
            db.query(sql2, values2, (error, user) => {
              if (error) {
                next(error);
              } else {
                res.status(200).json({user: user});
            }
        });
      }
    });
    });
    
  });

  usersRouter.get('/login', (req, res, next) => {
    if (req.session.absorbUser) {
      res.status(200).json({loggedIn: true, user: req.session.absorbUser});
    } else {
      res.status(400).json({loggedIn: false});
    }
  })

  usersRouter.post('/check', (req, res, next) => {
    const email = req.body.email;
    const sql = 'SELECT * FROM users WHERE email = ?';
    const values = [
      email
    ]
    
    db.query(sql, values, (err, users) => {
      if (err){
        next(err);
      } else {
        console.log("checking database...");
        res.status(200).json({users: users});
      }
    })
  })

  usersRouter.post('/login', (req, res, next) => {

    const username = req.body.user.username;
    const password = req.body.user.password;

    const sql = 'SELECT * FROM users WHERE username = ?';
    const values = [
        username
    ];

    db.query(sql, values, (error, user) => {
        if (error){
            next(error);
        }else {
            bcrypt.compare(password, user[0].password, (err, result) => {
              if (result){
                req.session.absorbUser = user;
                req.session.save();
                const id = user[0].id;
                const token = jwt.sign({id}, process.env.TOKEN_SECRET, {
                  expiresIn: 300
                });
                console.log(req.session.absorbUser);
                res.status(200).json({auth: true, token: token, user: user});
              } else {
                res.status(400);
              }
            } )
            }
        });
  });

  usersRouter.delete('/logout', (req, res, next) => {
    console.log("clearing cookie...");
    req.session.destroy( function (err){
      res.clearCookie('userId').send({message: "cookied cleared"});
    });
  });


module.exports = usersRouter;

