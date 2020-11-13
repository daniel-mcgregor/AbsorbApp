
const express = require('express');
const folderItemsRouter = express.Router();

const sqlite3 = require('sqlite3');
const db = new sqlite3.Database('./database.sqlite');


folderItemsRouter.param('folderName', (req, res, next, folderName) => {
    const sql = 'SELECT * FROM Entries WHERE folder = $folderName';
    const values = {$folderName: folderName};
    db.all(sql, values, (error, folderItems) => {
      if (error) {
        next(error);
      } else if (folderItems) {
        next();
      } else {
        res.sendStatus(404);
      }
    });
  });

 folderItemsRouter.get('/:folderName', (req, res, next) => {
    const sql = 'SELECT * FROM Entries WHERE Entries.folder = $folderName';
    const values = { $folderName: req.params.folderName};
    db.all(sql, values, (error, folderItems) => {
      if (error) {
        next(error);
      } else {
        res.status(200).json({folderItems: folderItems});
      }
    });
  });

  module.exports = folderItemsRouter;