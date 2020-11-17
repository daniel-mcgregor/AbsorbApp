const express = require('express');
const apiRouter = express.Router();
const foldersRouter = require('./folders.js');
const folderItemsRouter = require('./folderItems.js');

apiRouter.use('/folders', foldersRouter);

module.exports = apiRouter;