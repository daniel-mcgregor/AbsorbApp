
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

  module.exports = folderItemsRouter;