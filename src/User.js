const crypto = require('crypto');
const moment = require('moment-timezone');

const DB = require('./DB.js')
const Util = require('./Util.js')

async function getUserData(user_id, key) {
    return new Promise(resolve => {
        
        if (user_id == "" || key == "" || user_id === undefined || key === undefined) {
            resolve(-1)
            return
        }

        var q = "SELECT * FROM users WHERE google_account_id = ? AND auth_key = ?";
        DB.con.query(q, [user_id, key], (error, result) => {
            if (error) {
                console.log(error)
                resolve(-1);
            }
            if(result.length == 0) {
                resolve(-1)
            }

            if (result[0] != null) {
                if (result[0].auth_key == key) {
                    let exp = new Date(result[0].auth_exp);
                    if (exp > new Date()) {
                        var user_data = JSON.parse(JSON.stringify(result[0]));
                        //ensure we unpack stored text jsons...

                        if(user_data.my_devices != null) {
                            user_data.my_devices = JSON.parse(user_data.my_devices)
                        }

                        if(user_data.amenities != null) {
                            user_data.amenities = JSON.parse(user_data.amenities)
                        }
                        
                        resolve(user_data)

                    } else {
                         console.log("Key expired:", exp)
                        resolve(-1)
                    }
                } else {
                     console.log("Invalid Key")
                    resolve(-1);
                }
            } else {
                console.log("No email and key match")
                resolve(-1);
            }
        });
    });
}

async function submitOnboarding(user_data, payload, res){
    //TODO: check if username exists.
    console.log("SUBMITTING:", payload)
        if(payload.role == "THOT") {
            var q1 = "UPDATE users SET role = ?, username = ?, location = ?, birthday = ?, tagline = ?, bio = ? WHERE user_id = ?"
        
            DB.con.query(q1, [payload.role, payload.username, payload.location, payload.birthday, payload.tagline, payload.bio, user_data.user_id], (error, result) => {
                if (error) {
                    console.log(error)
                } else {
                    res.send("ok")
                }
            });

        } else if(payload.role == "CAPTAIN") {
            var q1 = "UPDATE users SET role = ?, username = ?, location = ?, boat_name = ?, tagline = ?, bio = ?, boat_year = ?, boat_length = ?, boat_capacity = ?, boat_bathrooms = ?, boat_bedrooms = ?, boat_floors = ?, amenities = ? WHERE user_id = ?"
        
            DB.con.query(q1, [payload.role, payload.username, payload.location, payload.boat_name, payload.tagline, payload.bio, payload.boat_year, payload.boat_length, payload.boat_capacity, payload.boat_bathrooms, payload.boat_bedrooms, payload.boat_floors, JSON.stringify(payload.amenities), user_data.user_id], (error, result) => {
                if (error) {
                    console.log(error)
                } else {
                    res.send("ok")
                }
            });
        }
}

async function loginOrRegisterGoogle(payload) {
  
    return new Promise(resolve => {
    var q1 = "UPDATE users SET email = ?, auth_key = ?, auth_exp = ? WHERE google_account_id = ?"

    var token = crypto.randomBytes(64).toString('hex');
    var exp = moment(new Date().addDays(365)).format('YYYY-MM-DD HH:mm:ss');


    DB.con.query(q1, [payload.email, token, exp, payload.sub], (error, result) => {
        if (error) {
            console.log(error)
        } else {

            if (result.changedRows == 0) {
                //This will return user data after it is registered..
                console.log("NO GOOGLE ASSOCIATED ACCOUNT EXISTS, CREATING ACCOUNT WITH THIS ONE...")
                resolve(registerUser(payload, token, exp))
            } else {
                console.log("GOOGLE ASSOCIATED ACCOUNT EXISTS, RETURNING CREDENTIALS")
                resolve(getUserData(payload.sub, token))
            }


        }
    });
    });
}

async function checkIfUsernameExists(username) {
    return new Promise(resolve => {
        var q = "SELECT FROM users WHERE username = ?";
        DB.con.query(q1, [username], (error, results) => {
            if (error) {
                console.log(error)
            } else {
                if(results.length > 0) {
                    resolve(true)
                } else {
                    resolve(false)
                }
            }
        });
});
}

async function onboardUser(uid, username, res) {
    var username_exists = await checkIfUsernameExists(username)
    if(username_exists) {
        res.send("username-exists")
    }
}

async function registerUser(new_user_data_p, token_p, exp) {
    return new Promise(resolve => {

        let new_user_data = new_user_data_p;
        let token = token_p;
        
            console.log("Registering Google User:",new_user_data);
            var q1 = "INSERT into users(google_account_id, email, display_name, auth_key, auth_exp) VALUES (?,?,?,?,?)";
            DB.con.query(q1, [new_user_data.sub, new_user_data.email, new_user_data.name, token, exp], (error, result) => {
                if (error) {
                    console.log(error)
                } else {
                   //Success
                   resolve(getUserData(new_user_data.sub, token, "google"))
                }
            });
    });
}


async function getFeedUsers(role) {
    return new Promise(resolve => {
        var q  = "SELECT * FROM users WHERE role = ?"
        DB.con.query(q, [role], (error, results) => {
            if (error) {
                console.log(error)
            } else {
                resolve(results)
            }
        });
    });
}

async function getProfileData(uid) {
    return new Promise(resolve => {
        var q  = "SELECT * FROM users WHERE user_id = ?"
        DB.con.query(q, [uid], (error, results) => {
            if (error) {
                console.log(error)
            } else {
                if(results[0].amenities != null) {
                    results[0].amenities = JSON.parse(results[0].amenities)
                }
                if(results[0].my_devices != null) {
                    results[0].my_devices = JSON.parse(results[0].my_devices)
                }
                resolve(results[0])
            }
        });
    });
}

async function sendPrivateMessage(user_data, message_content, to_uid) {
    var q = "INSERT INTO messages(from_uid, to_uid, content) VALUES (?,?,?)";
    DB.con.query(q, [user_data.user_id, to_uid, message_content], (error, results) => {
        if (error) {
            console.log(error)
        } else {
          console.log("Message Sent")
        }
    });

}

async function getMessageChain(from_uid, to_uid) {

    var message_chain = []
    return new Promise(resolve => {
        var q = "SELECT * FROM messages WHERE from_uid = ? and to_uid = ?"
        DB.con.query(q, [from_uid, to_uid], (error, my_messages) => {
            if (error) {
                console.log(error)
            } else {
               message_chain = my_messages;
               for(var i = 0; i < message_chain.length; i++) {
                message_chain[i].mine = 1;
            }
              // console.log("Got my messages:", message_chain)
               var q2 = "SELECT * FROM messages WHERE to_uid = ? and from_uid = ?"
               DB.con.query(q2, [from_uid, to_uid], (error, their_messages) => {
                    if (error) {
                        console.log(error)
                    } else {
                        //message_chain.push(their_messages);
                        for(var i = 0; i < their_messages.length; i++) {
                            message_chain.push(their_messages[i])
                        }
                        //console.log("Got All Messages:", message_chain)
                        message_chain.sort(function(x, y){
                            //console.log("SORTING:", x.timestamp)
                            var date1 = moment(x.timestamp, 'YYYY-MM-DD HH:mm:ss').toDate();
                        
                            //console.log("DATE1", date1)
                            var date2 = moment(y.timestamp, 'YYYY-MM-DD HH:mm:ss').toDate();
                           // console.log("DATE2", date2)
                            return date1 - date2
                        })
                        resolve(message_chain)
                    }
                })
            }
        });
    });
}

async function getUsernamesFromList(u_uid_list) {
    return new Promise(resolve => {

        var username_list = []
        var addt = ""

        if(u_uid_list.length == 0) {
            resolve(-1)
            return
        }
        for(var i = 1; i < u_uid_list.length; i++) {
            addt = addt + " OR user_id = " + u_uid_list[i];
        }
        var q = "SELECT user_id, username FROM users WHERE user_id = " + u_uid_list[0] + addt;
       // console.log("USER MESSAGE LIST Q:", q)
        DB.con.query(q, (error, users) => {
            if (error) {
                console.log(error)
            } else {
                for(var i = 0; i < users.length; i++) {
                    username_list.push( {
                        user_id: users[i].user_id,
                        username: users[i].username
                    })
                }
                resolve(username_list)
            }
        });
    })
}

async function getMyMessagePreviews(user_id) {
    return new Promise(resolve => {
        var q = "SELECT * FROM messages WHERE from_uid = ? OR to_uid = ?"; //We can sort by timestamp with this query
        DB.con.query(q, [user_id, user_id], (error, messages) => {
            if (error) {
                console.log(error)
            } else {
                var user_uid_list = []
                for(var i = 0; i < messages.length; i++) {
                    if(messages[i].from_uid == user_id) {
                        user_uid_list.push(messages[i].to_uid)
                    } else if(messages[i].to_uid == user_id) {
                        user_uid_list.push(messages[i].from_uid)
                    }
                }
                //now remove duplicates

                var u_uid_list = Util.removeDuplicates(user_uid_list);

                (async function() {
                    var message_user_list = await getUsernamesFromList(u_uid_list)

                    for(var i = 0; i < message_user_list.length; i++) {
                        for(var j = 0; j < messages.length; j++) {
                            if(messages[j].to_uid == message_user_list[i].user_id || messages[j].from_uid == message_user_list[i].user_id) {
                                message_user_list[i].content = messages[j].content
                                if(message_user_list[i].content.length > 10) {
                                    message_user_list[i].content = message_user_list[i].content.substring(0, 10) 
                                }
                                 message_user_list[i].timestamp = messages[j].timestamp
                            }
                        }
                    }
                    resolve(message_user_list)
                })()
            }
        });
    });
}

function ping() {
    var q = "SELECT username FROM users LIMIT 1";
    DB.con.query(q, (error, messages) => {
        if (error) {
            console.log(error)
        } else {
           // console.log("pong")
        }
    });
}

module.exports = {
    ping,
    getMyMessagePreviews,
    getMessageChain,
    sendPrivateMessage,
    getProfileData,
    getFeedUsers,
    submitOnboarding,
    getUserData,
    loginOrRegisterGoogle
}