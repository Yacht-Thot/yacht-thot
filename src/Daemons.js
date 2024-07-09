const schedule = require('node-schedule');
const webPush = require("web-push");
const User = require("./User.js");

console.log("Starting Daemons")

schedule.scheduleJob('0 * * * *', () => {
    hourDaemon();
})

function hourDaemon() {
    User.ping()
}