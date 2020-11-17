const express = require('express');
const foldersRouter = express.Router();

const sqlite3 = require('sqlite3');
const db = new sqlite3.Database('./database.sqlite');

const folderItemsRouter = require('./folderItems.js');


foldersRouter.param('folderId', (req, res, next, folderId) => {
    const sql = 'SELECT * FROM Folders WHERE id = $folderId';
    const values = {$folderId: folderId}
    db.get(sql, values, (error, folder) => {
        if (error) {
            next(error);
        }else if (folder) {
            req.name = folder;
            next();
        }else {
            res.sendStatus(404);
        }
    });
});


foldersRouter.get('/', (req, res, next) => {
    db.all('SELECT * FROM Folders', (error, folders) => {
        if (error){
            next(error);
        }else{
            res.status(200).json({folders: folders});
        }
    });
});

foldersRouter.get('/folderItems', (req, res, next) => {
    console.log("PASS")
    db.all('SELECT * FROM Entries', (error, folderItems) => {
      if (error) {
        next(error);
      } else {
        res.status(200).json({folderItems: folderItems});
      }
    });
  });

module.exports = foldersRouter;