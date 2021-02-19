const express = require('express');
const apiRouter = express.Router();
const foldersRouter = require('./folders.js');
const usersRouter = require('./users.js');

apiRouter.use('/folders', foldersRouter);
apiRouter.use('/users', usersRouter);

module.exports = apiRouter;