const express = require('express');
const apiRouter = express.Router();
const foldersRouter = require('./folders.js');
const folderNameRouter = require('./folderName.js');

apiRouter.use('/folders', foldersRouter);
// apiRouter.use('/folderName', folderNameRouter);

module.exports = apiRouter;