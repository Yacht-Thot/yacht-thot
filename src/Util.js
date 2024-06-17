const { con } = require('./DB');

const fs = require('fs').promises;
const readline = require('readline');

function askQuestion(query) {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    return new Promise(resolve => rl.question(query, ans => {
        rl.close();
        resolve(ans);
    }))
}


function delay(time) {
    return new Promise(function(resolve) { 
        setTimeout(resolve, time)
    });
 }

 async function fileExists(f) {
    try {
      await fs.stat(f);
      return true;
    } catch {
      return false;
    }
  }

  
  function getRandomInt(max) {
    return Math.floor(Math.random() * max);
  }

function log(platform, m, Stats) {
  var message = "["+platform+"]["+ new Date().toLocaleTimeString() +"] " + m;
  Stats.stats.log =Stats.stats.log + "<div>" + message + "</div>"
  console.log(message)
}
 
function getCurrentDate() {
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, '0');
  var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
  var yyyy = today.getFullYear();

  return mm + '/' + dd + '/' + yyyy;
}

module.exports = {
  askQuestion,
  getCurrentDate,
  log,
  delay,
  fileExists,
  getRandomInt
}