const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const config = require("../../config")

let is_new_db = !fs.existsSync(path.join(config.DB_PATH,"radio.sqlite"));

let db = new sqlite3.Database(path.join(config.DB_PATH,"radio.sqlite"), (err) => {
    if (err) {
        console.error(err.message);
    } else {
        console.log({is_new_db})
        initDB(is_new_db);
        console.log('Connected to the Radio database.');
    }
});

function initDB(is_new_db) {
    if (is_new_db) {
        db.serialize(function() {
            console.log("Executing Init DB")
            // create table tracks
            db.run("create table tracks(track_id integer primary key autoincrement, track_title varchar, original_track_title varchar, track_path varchar, created_on DATE default (datetime('now','localtime')))");

            // create table dedicatelist
            db.run("create table dedicatelist(dl_id integer primary key autoincrement, track_id integer, aired_status boolean default false, liq_id integer, timestamp integer not null, created_on DATE default (datetime('now','localtime')), foreign key(track_id) references tracks(track_id) on update cascade on delete cascade)");

            // create table dedicatemessage
            db.run("create table dedicatemessage(dmsg_id integer primary key autoincrement, dedicatelist_id integer, dedicator_message varchar not null, dedicator_name varchar not null, created_on DATE default (datetime('now','localtime')), foreign key(dedicatelist_id) references dedicatelist(dl_id) on update cascade on delete cascade)");
        })
    }
}

module.exports = db;