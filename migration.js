const sqlite3 = require('sqlite3');
const db = new sqlite3.Database('./database.sqlite');

db.serialize(function() {
  db.run('DROP TABLE IF EXISTS Folders');

  db.run('CREATE TABLE IF NOT EXISTS `Folders` ( ' +
           '`id` INTEGER NOT NULL, ' +
           '`name` TEXT NOT NULL UNIQUE, ' +
           'PRIMARY KEY(`id`))' );
  db.run('DROP TABLE IF EXISTS Entries');
  db.run('CREATE TABLE IF NOT EXISTS `Entries` ( ' +
           '`id` INTEGER NOT NULL, ' +
           '`folder` TEXT NOT NULL, ' +
           '`folder_id` INTEGER NOT NULL,' +
           '`entry` TEXT NOT NULL, ' +
           '`score` INTEGER NOT NULL DEFAULT 0, ' +
           '`def1` TEXT NOT NULL, ' +
           '`def2` TEXT, ' +
           '`def3` TEXT, ' +
           '`key1` TEXT, ' +
           '`key2` TEXT, ' +
           '`key3` TEXT, ' +
           '`key4` TEXT, ' +
           '`key5` TEXT, ' +
           '`key6` TEXT, ' +
           'PRIMARY KEY(`id`)' + 
           'FOREIGN KEY(`folder`) REFERENCES `Folders` (`name`)) ');
});

