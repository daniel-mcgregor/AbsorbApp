
const express = require('express');
const folderItemsRouter = express.Router({mergeParams: true});
const jwt = require('jsonwebtoken');
require("dotenv").config();
var mysql = require('mysql');

var db = mysql.createConnection({
  host: "localhost",
  user: "dantheman",
  password: "withaplan",
  database: 'absorbdatabase',
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

 folderItemsRouter.post('/returnFolderItems', verifyJWT, (req, res, next) => {
    const sql = "SELECT * FROM Entries WHERE folder = ? AND userId = ?";
    const values = [req.params.folderName, req.body.userId]
    db.query(sql, values, (error, folderItems) => {
      if (error) {
        next(error);
      } else {
        res.status(200).json({folderItems: folderItems});
      }
    });
  });

  folderItemsRouter.post('/:low/:high', verifyJWT, (req, res, next) => {
    const sql = "SELECT * FROM Entries WHERE score >= ? AND score <= ? AND folder = ? AND userId = ?";
    const values = [
      req.params.low,
      req.params.high,
      req.params.folderName,
      req.body.userId
    ];
    db.query(sql, values, (error, folderItems) => {
      if (error) {
        next(error);
      } else {
        res.status(200).json({folderItems: folderItems});
      }
    });
  });


  folderItemsRouter.post('/:selected', verifyJWT, (req, res, next) => {

    const sql = "SELECT * FROM Entries WHERE folder = ? AND entry = ? AND userId = ?";
    const values = [
      req.params.folderName,
      req.params.selected,
      req.body.userId
    ];
    db.query(sql, values, (error, folderItemContents) => {
      if (error) {
        next(error);
      } else {
        res.status(200).json({folderItemContents: folderItemContents});
      }
    });
  });


  folderItemsRouter.put('/', verifyJWT, (req, res, next) => {
    
    const folder = req.body.newEntryItems.folder;
    const entry = req.body.newEntryItems.entry;
    const score = req.body.newEntryItems.score;
    const def1 = req.body.newEntryItems.def1;
    const key1 = req.body.newEntryItems.key1;
    const id = req.body.newEntryItems.id;
    const userId = req.body.userId;

        const sql = "UPDATE Entries SET " + 
        "entry = ?, def1 = ?, key1 = ?, score = ? " +
        "WHERE id = ? AND folder = ? AND userId = ?";
        const values = [entry, def1, key1, score, id, folder, userId];

        db.query(sql, values, function(error) {
          if (error) {
            next(error);
          } else {
            const sql2 = "SELECT * FROM Entries WHERE folder = ? AND userId = ?";
            const values2 = [folder, userId];
            db.query(sql2, values2, (error, folderItems) => {
              if (error) {
                next(error);
              } else {
                res.status(200).json({folderItems: folderItems});
              }
            });
          }
        });
      });


  folderItemsRouter.post('/', verifyJWT, (req, res, next) => {
    
    const folder = req.body.newEntryItems.folder;
    const entry = req.body.newEntryItems.entry;
    const score = 0;
    const defs = req.body.newEntryItems.def1;
    const keys = req.body.newEntryItems.key1;
    const userId = req.body.userId

  
        const sql = 'INSERT INTO Entries (folder, entry, score, def1, key1, userId)' +
            'VALUES (?, ?, ?, ?, ?, ?)';

        const values = [folder, entry, score, defs, keys, userId];

        db.query(sql, values, function(error) {
          if (error) {
            next(error);
          } else {
            const sql2 = "SELECT * FROM Entries WHERE folder = ? AND userId = ?";
            const values2 = [folder, userId];
            db.query(sql2, values2, (error, folderItems) => {
              if (error) {
                next(error);
              } else {
                res.status(200).json({folderItems: folderItems});
              }
            });
          }
        });
      });

  folderItemsRouter.delete('/:id', verifyJWT, (req, res, next) => {
    const sql = 'DELETE FROM Entries WHERE id = ? AND userId = ?';
    const values = [req.params.id, req.body.userId];
  
    db.query(sql, values, function(error) {
          if (error) {
            next(error);
          } else {
            const sql2 = "SELECT * FROM Entries WHERE folder = ? AND userId = ?";
            const values2 = [req.params.folderName, req.body.userId];
            db.query(sql2, values2, (error, folderItems) => {
              if (error) {
                next(error);
              } else {
                res.status(200).json({folderItems: folderItems});
              }
            });
          }
        });
  });


  module.exports = folderItemsRouter;