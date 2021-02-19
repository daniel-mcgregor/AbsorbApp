
const express = require('express');
const usersRouter = express.Router();

var mysql = require('mysql');

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
    const values = [
        username,
        email,
        password
    ];
    db.query(sql, values, (error) => {
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


  usersRouter.post('/login', (req, res, next) => {

    const username = req.body.user.username;
    const password = req.body.user.password;

    const sql = 'SELECT * FROM users WHERE username = ? AND password = ?';
    const values = [
        username,
        password
    ];
    db.query(sql, values, (error, user) => {
        if (error){
            next(error);
        }else {
            res.status(200).json({user: user});
            }
        });
  });


module.exports = usersRouter;