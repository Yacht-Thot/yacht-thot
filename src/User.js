const crypto = require('crypto');
const moment = require('moment-timezone');

const DB = require('./DB.js')

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
            var q1 = "UPDATE users SET role = ?, username = ?, birthday = ?, tagline = ?, bio = ? WHERE user_id = ?"
        
            DB.con.query(q1, [payload.role, payload.username, payload.birthday, payload.tagline, payload.bio, user_data.user_id], (error, result) => {
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


module.exports = {
    submitOnboarding,
    getUserData,
    loginOrRegisterGoogle
}