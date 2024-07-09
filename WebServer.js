const express = require('express');
const exphbs = require('express-handlebars');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const path = require("path");

require('dotenv').config({ path: './app.env' })

const {OAuth2Client} = require('google-auth-library');
const googleOAuthClient = new OAuth2Client();

const Util = require("./src/Util.js");
const User = require("./src/User.js");

require("./src/Daemons.js")


var current_version;

var exec = require('child_process').exec;
function execute(command, callback){
    exec(command, function(error, stdout, stderr){ callback(stdout); });
};

async function getVersion() {
    return new Promise(resolve => {
        var cmd = "git rev-list --count --first-parent HEAD";
        execute(cmd, function(res){
            resolve(res.trim());
        });
    });
}

(async function() {
    current_version = await getVersion();
    console.log("Starting Vesion:", current_version)
})()



function inLocalDevMode() {
    if(process.env.DEV === "LOCALHOST") {
        return true;
    } 
    return false;
}


if(inLocalDevMode()) {
    console.log("Starting Server in DEV mode")
}
// Setup WebServer
const app = express();

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json())
app.use(cookieParser());

app.use(express.static(__dirname + '/public', {
    maxAge: Number.MAX_VALUE,
    etag: false,
    acceptRanges: false
   }));
app.set('views', path.join(__dirname, '/views'));
app.set('partials', path.join(__dirname, '/partials'));
app.engine('hbs', exphbs.engine({
    extname: '.hbs',
    helpers: require('./config/handlebars-helpers')
}));

app.set('view engine', 'hbs');

app.listen(process.env.HTTP_PORT, () => 
    console.log(`Listening for HTTP on port ${process.env.HTTP_PORT}!`));


app.get('/logout', (req, res) => {
    res.cookie('uid', "", { maxAge: 0 });
    res.cookie('auth_key',"", { maxAge: 0 });
    res.redirect("/")
})

app.get('/', async (req, res) => {

var user_data = await User.getUserData(req.cookies['uid'], req.cookies['auth_key']);
if(user_data != -1) {
    res.redirect("/feed")
} else {
    var google_redirect_url = "http://localhost:8069/google-auth"
    if(!inLocalDevMode()) {
        google_redirect_url = "https://yachtthot.com/google-auth"
    }
        res.render('index',
            {
            title: "Yacht Thot - Party Boats Near Me",
            description: "",
            google_client_id: process.env.GOOGLE_CLIENT_ID,
            google_redirect_url: google_redirect_url,
            user_data: user_data,
            current_version: current_version
            }
        )
    }
});

app.get('/faq', async (req, res) => {

    var user_data = await User.getUserData(req.cookies['uid'], req.cookies['auth_key']);

    res.render('faq',
        {
           title: "Yacht Thot - FAQs",
           description: "",
           user_data: user_data,
           current_version: current_version
        }
    )
});

app.get('/support', async (req, res) => {

    var user_data = await User.getUserData(req.cookies['uid'], req.cookies['auth_key']);

    res.render('support',
        {
           title: "Yacht Thot - Support",
           description: "",
           user_data: user_data,
           current_version: current_version
        }
    )
});

app.get('/refresh-messages', async (req, res) => {

    var user_data = await User.getUserData(req.cookies['uid'], req.cookies['auth_key']);

    var messager_p_data = await User.getProfileData(req.query.uid)
    console.log(messager_p_data)
    message_to_username = messager_p_data.username
    message_to_uid = messager_p_data.user_id;

    var message_chain = await User.getMessageChain(user_data.user_id, req.query.uid)

    res.send(message_chain)



});

app.get('/profile', async (req, res) => {

    var user_data = await User.getUserData(req.cookies['uid'], req.cookies['auth_key']);

    if(user_data == -1) {
        res.redirect("/")
        return
    }
    
    var profile_data = await User.getProfileData(req.query.uid)

    var r_templ = profile_data.role.toLowerCase()

    res.render(r_templ,
        {
           title: "Yacht Thot - " + user_data.username,
           description: "",
           user_data: user_data,
           profile_data: profile_data,
           show_action_bar: 1,
           current_version: current_version
        }
    )
});

app.get('/messages', async (req, res) => {

    var user_data = await User.getUserData(req.cookies['uid'], req.cookies['auth_key']);

    if(user_data == -1) {
        res.redirect("/")
        return
    }

    var message_to_username = ""
    var message_to_uid = ""
    var message_chain = null;
    var message_users = -1

    if(req.query.uid) {
        var messager_p_data = await User.getProfileData(req.query.uid)
        console.log(messager_p_data)
        message_to_username = messager_p_data.username
        message_to_uid = messager_p_data.user_id;
    
        var message_chain = await User.getMessageChain(user_data.user_id, req.query.uid)
        console.log("Got message Chainnnn!", message_chain)
    } else {
        var message_users = await User.getMyMessageUsers(user_data.user_id)
        if(message_users.length == 0) message_users = -1;
        console.log("Got message users:", message_users)
    }

    res.render('messages',
        {
           title: "Yacht Thot - Messages",
           description: "",
           user_data: user_data,
           message_to_username: message_to_username,
           message_to_id: message_to_uid,
           message_users: message_users,
           message_chain: message_chain,
           current_version: current_version
        }
    )
});

app.get('/my-profile', async (req, res) => {

    var user_data = await User.getUserData(req.cookies['uid'], req.cookies['auth_key']);

    if(user_data == -1) {
        res.redirect("/")
        return
    }

    var r_role = user_data.role.toLowerCase();

    res.render(r_role,
        {
           title: "Yacht Thot - " + user_data.username,
           description: "",
           user_data: user_data,
           profile_data:user_data,
           show_action_bar: 0,
           current_version: current_version
        }
    )
});

app.get('/feed', async (req, res) => {

    var user_data = await User.getUserData(req.cookies['uid'], req.cookies['auth_key']);

    if(user_data == -1) {
        res.redirect("/")
        return;
    }

    var r_t = 'captain-feed'
    if(user_data.role == "THOT") {
        var captains = await User.getFeedUsers("CAPTAIN")
        r_t = "thot-feed"
    } else {
        var thots = await User.getFeedUsers("THOT")
    }

    res.render(r_t,
        {
           title: "Yacht Thot - Home",
           description: "",
           thots: thots,
           captains: captains,
           user_data: user_data,
           current_version: current_version
        }
    )
});

app.post('/submit-onboarding', async (req, res) => {

    var user_data = await User.getUserData(req.cookies['uid'], req.cookies['auth_key']);
    var payload = req.body;
    console.log(payload)
    User.submitOnboarding(user_data, payload, res)
    
});

app.post("/send-private-message", async (req, res) => {
    var user_data = await User.getUserData(req.cookies['uid'], req.cookies['auth_key']);

    User.sendPrivateMessage(user_data, req.body.message_content, req.body.to_uid)
  });

app.get('/privacy-policy', async (req, res) => {

    var user_data = await User.getUserData(req.cookies['uid'], req.cookies['auth_key']);

    res.render('privacy-policy',
        {
           title: "Yacht Thot - Privacy Policy",
           description: "",
           user_data: user_data,
           current_version: current_version
        }
    )
});

app.get('/terms-of-service', async (req, res) => {

    var user_data = await User.getUserData(req.cookies['uid'], req.cookies['auth_key']);

    res.render('terms-of-service',
        {
           title: "Yacht Thot - Terms of Service",
           description: "",
           user_data: user_data,
           current_version: current_version
        }
    )
});

app.get('/sign-in', async (req, res) => {

    var user_data = await User.getUserData(req.cookies['uid'], req.cookies['auth_key']);

    res.render('sign-in',
        {
           title: "Yacht Thot - Sign In",
           description: "",
           user_data: user_data,
           current_version: current_version
        }
    )
});

app.get('/about', async (req, res) => {

    var user_data = await User.getUserData(req.cookies['uid'], req.cookies['auth_key']);

    res.render('about',
        {
           title: "Yacht Thot - About Us",
           description: "",
           user_data: user_data,
           current_version: current_version
        }
    )
});

app.get('/onboarding', async (req, res) => {

    var user_data = await User.getUserData(req.cookies['uid'], req.cookies['auth_key']);

    if(user_data == -1) {
        res.redirect("/")
        return
    }

    res.render('onboarding',
        {
           title: "Yacht Thot - Onboarding",
           description: "",
           user_data: user_data,
           current_version: current_version
        }
    )
});

async function verifyGoogleToken(token, res, req) {
    const ticket = await googleOAuthClient.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();
    const google_user_id = payload['sub'];
    user_data = await User.loginOrRegisterGoogle(payload)

    //Set Cookie
    res.cookie('uid',google_user_id, { maxAge: 1314000000000, httpOnly: true });
    res.cookie('auth_key',user_data.auth_key, { maxAge: 1314000000000, httpOnly: true });
    res.redirect('/')
    return;



    // If request specified a G Suite domain:
    // const domain = payload['hd'];
  }

  app.post("/google-auth", async (req, res) => {
    //todo: csrf verification? Dumb..
    console.log("POST google auth code:", req.body)
    verifyGoogleToken(req.body.credential, res, req).catch(console.error);
  });

//app.get('/update', (req, res) => { res.send(JSON.stringify(Stats.stats)) });
