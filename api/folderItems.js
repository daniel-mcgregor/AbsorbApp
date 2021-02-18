
const express = require('express');
const folderItemsRouter = express.Router({mergeParams: true});

var mysql = require('mysql');

var db = mysql.createConnection({
  host: "localhost",
  user: "dantheman",
  password: "withaplan",
  database: 'absorbdatabase',
  insecureAuth : true
});

 folderItemsRouter.get('/', (req, res, next) => {
    const sql = "SELECT * FROM Entries WHERE folder = ?";
    const values = [req.params.folderName]
    db.query(sql, values, (error, folderItems) => {
      if (error) {
        next(error);
      } else {
        res.status(200).json({folderItems: folderItems});
      }
    });
  });

  folderItemsRouter.get('/:low/:high', (req, res, next) => {
    const sql = "SELECT * FROM Entries WHERE score >= ? AND score <= ? AND folder = ?";
    const values = [
      req.params.low,
      req.params.high,
      req.params.folderName
    ];
    db.query(sql, values, (error, folderItems) => {
      if (error) {
        next(error);
      } else {
        res.status(200).json({folderItems: folderItems});
      }
    });
  });


  folderItemsRouter.get('/:selected', (req, res, next) => {

    const sql = "SELECT * FROM Entries WHERE folder = ? AND entry = ?";
    const values = [
      req.params.folderName,
      req.params.selected
    ];
    db.query(sql, values, (error, folderItemContents) => {
      if (error) {
        next(error);
      } else {
        res.status(200).json({folderItemContents: folderItemContents});
      }
    });
  });


  folderItemsRouter.put('/', (req, res, next) => {
    
    const folder = req.body.newEntryItems.folder;
    const entry = req.body.newEntryItems.entry;
    const score = req.body.newEntryItems.score;
    const def1 = req.body.newEntryItems.def1;
    const key1 = req.body.newEntryItems.key1;
    const id = req.body.newEntryItems.id;

        const sql = "UPDATE Entries SET " + 
        "entry = ?, def1 = ?, key1 = ?, score = ? " +
        "WHERE id = ? AND folder = ?";
        const values = [entry, def1, key1, score, id, folder];

        db.query(sql, values, function(error) {
          if (error) {
            next(error);
          } else {
            const sql2 = "SELECT * FROM Entries WHERE folder = ?";
            const values2 = [folder];
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


  folderItemsRouter.post('/', (req, res, next) => {
    
    const folder = req.body.newEntryItems.folder;
    const entry = req.body.newEntryItems.entry;
    const score = 0;
    const defs = req.body.newEntryItems.def1;
    const keys = req.body.newEntryItems.key1;

  
        const sql = 'INSERT INTO Entries (folder, entry, score, def1, key1)' +
            'VALUES (?, ?, ?, ?, ?)';

        const values = [folder, entry, score, defs, keys];

        db.query(sql, values, function(error) {
          if (error) {
            next(error);
          } else {
            const sql2 = "SELECT * FROM Entries WHERE folder = ?";
            const values2 = [folder];
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

  folderItemsRouter.delete('/:id', (req, res, next) => {
    const sql = 'DELETE FROM Entries WHERE id = ?';
    const values = [req.params.id];
  
    db.query(sql, values, function(error) {
          if (error) {
            next(error);
          } else {
            const sql2 = "SELECT * FROM Entries WHERE folder = ?";
            const values2 = [req.params.folderName];
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