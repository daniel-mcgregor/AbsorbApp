
const express = require('express');
const folderItemsRouter = express.Router({mergeParams: true});

const sqlite3 = require('sqlite3');
const db = new sqlite3.Database('./database.sqlite');

 folderItemsRouter.get('/', (req, res, next) => {
    const sql = "SELECT * FROM Entries WHERE Entries.folder = $folderName";
    const values = {$folderName: req.params.folderName}
    db.all(sql, values, (error, folderItems) => {
      if (error) {
        next(error);
      } else {
        res.status(200).json({folderItems: folderItems});
      }
    });
  });


  folderItemsRouter.get('/:selected', (req, res, next) => {
    const sql = "SELECT * FROM Entries WHERE Entries.folder = $folderName AND Entries.entry = $selected";
    const values = {
      $folderName: req.params.folderName,
      $selected: req.params.selected
    }
    db.get(sql, values, (error, folderItemContents) => {
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
    
    const folderSql = "SELECT * FROM Entries WHERE Entries.folder = $folderName";
    const folderValues = {$folderName: folder};
    db.all(folderSql, folderValues, (error, loaded) => {
      if (error) {
        next(error);
      } else {
        if (!folder || !entry || !score || !def1) {
          return res.status(400).send();
        }  

        const sql = "UPDATE Entries SET " + 
        "def1 = $def1, key1 = $key1 " +
        "WHERE Entries.entry = $entry AND Entries.folder = $folder";
        const values = {
          $entry: entry,
          $def1: def1,
          $key1: key1,
          $folder: folder
        };

        db.run(sql, values, function(error) {
          if (error) {
            next(error);
          } else {
            const sql2 = "SELECT * FROM Entries WHERE Entries.folder = $folderName";
            const values2 = {$folderName: folder};
            db.all(sql2, values2, (error, folderItems) => {
              if (error) {
                next(error);
              } else {
                res.status(200).json({folderItems: folderItems});
              }
            });
          }
        });
      }
    });
  });


  folderItemsRouter.post('/', (req, res, next) => {
    
    const folder = req.body.newEntryItems.folder;
    const entry = req.body.newEntryItems.entry;
    const score = "0";
    const defs = req.body.newEntryItems.def1;
    const keys = req.body.newEntryItems.key1;
    
    const folderSql = "SELECT * FROM Entries WHERE Entries.folder = $folderName";
    const folderValues = {$folderName: req.params.folderName};
    db.get(folderSql, folderValues, (error) => {
      if (error) {
        next(error);
      } else {
        if (!folder || !entry || !score || !defs) {
          return res.status(400).send();
        }
  
        const sql = 'INSERT INTO Entries (folder, entry, score, def1, key1)' +
            'VALUES ($folder, $entry, $score, $defs, $keys)';
        const values = {
          $folder: folder,
          $entry: entry,
          $score: score,
          $defs: defs,
          $keys: keys
        };

        db.run(sql, values, function(error) {
          if (error) {
            next(error);
          } else {
            const sql2 = "SELECT * FROM Entries WHERE Entries.folder = $folderName";
            const values2 = {$folderName: folder};
            db.all(sql2, values2, (error, folderItems) => {
              if (error) {
                next(error);
              } else {
                res.status(200).json({folderItems: folderItems});
              }
            });
          }
        });
      }
    });
  });


  module.exports = folderItemsRouter;