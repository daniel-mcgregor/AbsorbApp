
const express = require('express');
const foldersRouter = express.Router();
const jwt = require('jsonwebtoken');
require("dotenv").config();
const sqlite3 = require('sqlite3');

var mysql = require('mysql');

var db = mysql.createConnection({
    host: "localhost",
    user: "dantheman",
    password: "withaplan",
    database: 'absorbdatabase',
    insecureAuth : true
  });

const folderItemsRouter = require('./folderItems.js');

const verifyJWT = (req, res, next) => {
    const token = req.headers["x-access-token"];
    if (!token) {
      res.status(400);
    } else {
      jwt.verify(token, process.env.TOKEN_SECRET, (err, decoded) => {
        if (err) {
          res.status(400).json({auth: false, message: "authentication failed", err: err});
        } else {
          req.userId = decoded.id;
          next();
        }
      });
    }
  }


foldersRouter.param('folderName', (req, res, next, folderName) => {
    
    const sql = "SELECT * FROM folders WHERE name = ?";
    const values = [folderName];
    db.query(sql, values, (error, folder) => {
        if(error) {
            next(error);
        }else if (folder) {
            req.folder = folder;
            next();
        }else{
            res.sendStatus(404);
        }
    });
  });

  
foldersRouter.use('/:folderName/folder-items', folderItemsRouter);
foldersRouter.use('/:folderName/folder-items/:selected', folderItemsRouter);
foldersRouter.use('/:folderName/folder-items/:id', folderItemsRouter);
foldersRouter.use('/:folderName/folder-items/:low/:high', folderItemsRouter);
foldersRouter.use('/:folderName/folder-items/', folderItemsRouter);



foldersRouter.post('/', verifyJWT, (req, res, next) => {

    const userId = req.body.userId;
    const values = [
        userId
    ];

    db.query('SELECT * FROM folders WHERE userId = ?', values, (error, folders) => {
        if (error){
            next(error);
        }else{
            res.status(200).json({folders: folders});
        }
    });
});

foldersRouter.post('/newFolder', verifyJWT, (req, res, next) => {
    const sql = 'INSERT INTO folders (name, userId) VALUES (?, ?)';
    const values = [
        req.body.folderName,
        req.body.userId
    ];
    db.query(sql, values, (error, folders) => {
        if (error){
            next(error);
        }else{
            res.status(200).json({folders: folders});
        }
    });
});

foldersRouter.delete('/:folderName/:userId', verifyJWT, (req, res, next) => {

    const sql0 = 'DELETE FROM Entries WHERE folder = ? AND userId = ?';
    const values0 = [req.params.folderName, req.params.userId];
  
    db.query(sql0, values0, (error) => {
        if (error){
            next(error);
        }
    });

    const sql = 'DELETE FROM folders WHERE name = ? AND userId = ?';
    const values = [req.params.folderName, req.params.userId];
  
    db.query(sql, values, (error, folders) => {
        if (error){
            next(error);
        }else{
            res.status(200).json({folders: folders});
        }
    });
});


module.exports = foldersRouter;