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

app.get('/', async (req, res) => {
    //res.cookie('uid', "", { maxAge: 0 });
   // res.cookie('auth_key',"", { maxAge: 0 });

var user_data = await User.getUserData(req.cookies['uid'], req.cookies['auth_key']);
if(user_data != -1) {
    res.redirect("/captain-feed")
} else {
    var google_redirect_url = "http://localhost:8069/google-auth"
        res.render('index',
            {
            title: "Yacht Thot - Party Boats Near Me",
            description: "",
            google_client_id: process.env.GOOGLE_CLIENT_ID,
            google_redirect_url: google_redirect_url
            }
        )
    }
});

app.get('/faq', (req, res) => {
    res.render('faq',
        {
           title: "Yacht Thot - FAQs",
           description: ""
        }
    )
});

app.get('/support', (req, res) => {
    res.render('support',
        {
           title: "Yacht Thot - Support",
           description: ""
        }
    )
});

app.get('/captain', (req, res) => {
    res.render('captain',
        {
           title: "Yacht Thot - Username",
           description: ""
        }
    )
});

app.get('/thot', (req, res) => {
    res.render('thot',
        {
           title: "Yacht Thot - Username",
           description: ""
        }
    )
});

var sample_thots = [
    {
        username: "Alicia",
        age: "19",
        location: "Miami, FL",
        tagline: "Staying bad and bouji",
        photo_url: "/img/sample/alicia.jpg"
    },
    {
        username: "Baily",
        age: "22",
        location: "Omaha, NA",
        tagline: "A southern girl looking for boats",
        photo_url: "/img/sample/baily.jpg"
    },
    {
        username: "Jane",
        age: "34",
        location: "Jacksonville, FL",
        tagline: "I promise not to weigh down your boat.",
        photo_url: "/img/sample/veazy.jpg"
    }
]
app.get('/captain-feed', (req, res) => {
    res.render('captain-feed',
        {
           title: "Yacht Thot - Home",
           description: "",
           thots: sample_thots
        }
    )
});

var sample_capns = [
    {
        username: "Nick"
    },
    {
        username: "Jack"
    },
    {
        username: "Dave"
    }

]

app.get('/thot-feed', (req, res) => {
    res.render('thot-feed',
        {
           title: "Yacht Thot - Home",
           description: "",
           captains: sample_capns
        }
    )
});

app.get('/privacy-policy', (req, res) => {
    res.render('privacy-policy',
        {
           title: "Yacht Thot - Privacy Policy",
           description: ""
        }
    )
});

app.get('/terms-of-service', (req, res) => {
    res.render('terms-of-service',
        {
           title: "Yacht Thot - Terms of Service",
           description: ""
        }
    )
});

app.get('/boat', (req, res) => {
    res.render('boat',
        {
           title: "Yacht Thot - Boat Profile",
           description: ""
        }
    )
});

app.get('/sign-in', (req, res) => {
    res.render('sign-in',
        {
           title: "Yacht Thot - Sign In",
           description: ""
        }
    )
});

app.get('/about', (req, res) => {
    res.render('about',
        {
           title: "Yacht Thot - About Us",
           description: ""
        }
    )
});

app.get('/onboarding', (req, res) => {
    res.render('onboarding',
        {
           title: "Yacht Thot - Onboarding",
           description: ""
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
