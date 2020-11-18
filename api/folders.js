
const express = require('express');
const foldersRouter = express.Router();

const sqlite3 = require('sqlite3');
const db = new sqlite3.Database('./database.sqlite');

const folderItemsRouter = require('./folderItems.js');

foldersRouter.param('folderName', (req, res, next, folderName) => {
    const sql = "SELECT * FROM Folders WHERE Folders.name = $folderName";
    const values = {$folderName: folderName};
    db.get(sql, values, (error, folder) => {
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

foldersRouter.use('/:folderName/folder-items', folderItemsRouter)



foldersRouter.get('/', (req, res, next) => {
    db.all('SELECT * FROM Folders', (error, folders) => {
        if (error){
            next(error);
        }else{
            res.status(200).json({folders: folders});
        }
    });
});


module.exports = foldersRouter;