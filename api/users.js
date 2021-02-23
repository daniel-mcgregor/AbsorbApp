
const express = require('express');
const usersRouter = express.Router();

var mysql = require('mysql');

const bcrypt = require('bcryptjs');

const saltRounds = 10;

var db = mysql.createConnection({
  host: "localhost",
  user: "dantheman",
  password: "withaplan",
  database: 'absorbdatabase',
  insecureAuth : true
});



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
                console.log(req.session.absorbUser);
                res.status(200).json({user: user});
              } else {
                res.status(400);
              }
            } )
            }
        });
  });


module.exports = usersRouter;

