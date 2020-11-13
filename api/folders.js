const express = require('express');
const foldersRouter = express.Router();

const sqlite3 = require('sqlite3');
const db = new sqlite3.Database('./database.sqlite');

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