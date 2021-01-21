
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

  
foldersRouter.use('/:folderName/folder-items', folderItemsRouter);
foldersRouter.use('/:folderName/folder-items/:selected', folderItemsRouter);
foldersRouter.use('/:folderName/folder-items/:id', folderItemsRouter);
foldersRouter.use('/:folderName/folder-items/:low/:high', folderItemsRouter);



foldersRouter.get('/', (req, res, next) => {
    db.all('SELECT * FROM Folders', (error, folders) => {
        if (error){
            next(error);
        }else{
            res.status(200).json({folders: folders});
        }
    });
});

foldersRouter.post('/', (req, res, next) => {
    const sql = 'INSERT INTO Folders (name) VALUES ($name)';
    const values = {
        $name: req.body.folderName
    };
    db.all(sql, values, (error, folders) => {
        if (error){
            next(error);
        }else{
            res.status(200).json({folders: folders});
        }
    });
});

foldersRouter.delete('/:folderName', (req, res, next) => {

    const sql0 = 'DELETE FROM Entries WHERE Entries.folder = $name';
    const values0 = {$name: req.params.folderName};
  
    db.all(sql0, values0, (error) => {
        if (error){
            next(error);
        }
    });

    const sql = 'DELETE FROM Folders WHERE Folders.name = $name';
    const values = {$name: req.params.folderName};
  
    db.all(sql, values, (error, folders) => {
        if (error){
            next(error);
        }else{
            res.status(200).json({folders: folders});
        }
    });
});


module.exports = foldersRouter;