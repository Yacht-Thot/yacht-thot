const { con } = require('./DB');

const fs = require('fs').promises;
const moment = require('moment-timezone');
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

Date.prototype.addDays = function (days) {
  var date = new Date(this.valueOf());
  date.setDate(date.getDate() + days);
  return date;
}

function removeDuplicates(arr) {
  return arr.filter((item,
      index) => arr.indexOf(item) === index);
}

function getAgeFromDOB(birthday) {

 // console.log("Getting AGE:", birthday)
  var years = moment().diff(birthday.split(" ")[0], 'years');
  return years
}

function findZodiacSign(birthday) {
  var m = moment(birthday.split(" ")[0], "YYYY-MM-DD");



  var day = m.date()
  var month = m.month();

 // console.log("DAY:", day)
 // console.log("Month:", month)


  var zodiacSigns = {
    'capricorn':'♑ Capricorn',
    'aquarius':'♒ Aquarius',
    'pisces':'♓ Pisces',
    'aries':'♈ Aries',
    'taurus':'♉ Taurus',
    'gemini':'♊ Gemini',
    'cancer':'♋ Cancer',
    'leo':'♌ Leo',
    'virgo':'♍ Virgo',
    'libra':'♎ Libra',
    'scorpio':'♏ Scorpio',
    'sagittarius':'♐ Sagittarius'
  }

  if((month == 0 && day <= 19) || (month == 11 && day >=22)) {
    return zodiacSigns.capricorn;
  } else if ((month == 0 && day >= 20) || (month == 1 && day <= 18)) {
    return zodiacSigns.aquarius;
  } else if((month == 1 && day >= 19) || (month == 2 && day <= 20)) {
    return zodiacSigns.pisces;
  } else if((month == 2 && day >= 21) || (month == 3 && day <= 19)) {
    return zodiacSigns.aries;
  } else if((month == 3 && day >= 20) || (month == 4 && day <= 20)) {
    return zodiacSigns.taurus;
  } else if((month == 4 && day >= 21) || (month == 5 && day <= 20)) {
    return zodiacSigns.gemini;
  } else if((month == 5 && day >= 21) || (month == 6 && day <= 22)) {
    return zodiacSigns.cancer;
  } else if((month == 6 && day >= 23) || (month == 7 && day <= 22)) {
    return zodiacSigns.leo;
  } else if((month == 7 && day >= 23) || (month == 8 && day <= 22)) {
    return zodiacSigns.virgo;
  } else if((month == 8 && day >= 23) || (month == 9 && day <= 22)) {
    return zodiacSigns.libra;
  } else if((month == 9 && day >= 23) || (month == 10 && day <= 21)) {
    return zodiacSigns.scorpio;
  } else if((month == 10 && day >= 22) || (month == 11 && day <= 21)) {
    return zodiacSigns.sagittarius;
  }
}

function saveImageDataToFileSystemBuffer(buffer, imgID) {

  var imgPath = path.join(__dirname, 'public/img/user-photos/')


  fs.writeFile(imgPath + imgID + ".webp", buffer, {
      flag: 'w',
  }, function (err) {
      if (err)
          console.log("Image write error: " + err);
  });
}

module.exports = {
  saveImageDataToFileSystemBuffer,
  findZodiacSign,
  getAgeFromDOB,
  removeDuplicates,
  askQuestion,
  getCurrentDate,
  log,
  delay,
  fileExists,
  getRandomInt
}