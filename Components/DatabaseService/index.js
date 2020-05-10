const conNormal = require('./database.js');
const conPromise = require('./databasePromise.js');

let x = new conPromise();

module.exports = {
    'con': conNormal,
    'conPromise': x
}