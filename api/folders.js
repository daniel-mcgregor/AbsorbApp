
const express = require('express');
const foldersRouter = express.Router();

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



foldersRouter.get('/', (req, res, next) => {

    db.query('SELECT * FROM folders', (error, folders) => {
        if (error){
            next(error);
        }else{
            res.status(200).json({folders: folders});
        }
    });
});

foldersRouter.post('/', (req, res, next) => {
    const sql = 'INSERT INTO folders (name) VALUES (?)';
    const values = [
        req.body.folderName
    ];
    db.query(sql, values, (error, folders) => {
        if (error){
            next(error);
        }else{
            res.status(200).json({folders: folders});
        }
    });
});

foldersRouter.delete('/:folderName', (req, res, next) => {

    const sql0 = 'DELETE FROM Entries WHERE folder = ?';
    const values0 = [req.params.folderName];
  
    db.query(sql0, [values0], (error) => {
        if (error){
            next(error);
        }
    });

    const sql = 'DELETE FROM folders WHERE name = ?';
    const values = [req.params.folderName];
  
    db.query(sql, values, (error, folders) => {
        if (error){
            next(error);
        }else{
            res.status(200).json({folders: folders});
        }
    });
});


module.exports = foldersRouter;