const e = require('cors');
const express = require('express');
const folderNameRouter = express.Router();

const sqlite3 = require('sqlite3');
const db = new sqlite3.Database('./database.sqlite');


folderNameRouter.get('/:folderName/folder-items', (req, res, next) => {
    db.all("SELECT * FROM Entries WHERE Entries.folder = '$folderName'", {
        $folderName: req.params.folderName
    }, (error, folderItems) => {
        if (error){
            next(error);
        }else{
            res.status(200).send(folderItems);
        }
    });
});


module.exports = folderNameRouter;