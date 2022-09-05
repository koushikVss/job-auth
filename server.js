const express = require('express');
const logger = require('morgan');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');
const passport = require('passport');
const dbstore = require('connect-mongodb-session')(session);
const UserModel = require('./models/UserModel');
const routes = require('./routes/UserRoute');
const repo = require('./repository/UserRepository');
//
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const jwt = require('jsonwebtoken');
const SECRET_KEY = 'cat bites dog';
const findOrCreate = require("mongoose-findorcreate")
const cookieSession = require("cookie-session");
const localStorage = require('node-localstorage')
//

const passportSetup = require("./passport");
const authRoute = require("./routes/auth");
const app = express();
const cors = require("cors")
// const DB_URI = process.env.MONGODB_SERVER;
// const DB_URI = "mongodb://localhost:27017/AuthDB";
const DB_URI = "mongodb+srv://authdb:auth@authdb.7ocae8r.mongodb.net/?retryWrites=true&w=majority";

const store = new dbstore({
    uri: DB_URI,
    collection: 'app-sessions'
});
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
    cookieSession({ name: "session", keys: ["lama"], maxAge: 3000 })
);

mongoose.connect(DB_URI);
mongoose.connection.once('open', (err) => {
    if (!err) {
        console.log('Connected to DB');
    }
});

app.use(cors())
app.use(
    cors({
        // origin: process.env.FRONT,//"http://localhost:3000",
        origin: "https://huntjob.netlify.app",
        methods: "GET,POST,PUT,DELETE",
        credentials: true,
    })
)
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(session({
    secret: 'this is my secret',
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24
    },
    store: store,
    resave: false,
}));
app.use(
    cookieSession({ name: "session", keys: ["lama"], maxAge: 24 * 60 * 60 * 100 })
);

app.use(passport.initialize());
app.use(passport.session());


passport.use(repo.Login());



app.use("/auth", authRoute);

// app.use(
//     cors({
//         // origin: process.env.FRONT,//"http://localhost:3000",
//         origin: "http://localhost:3000",
//         methods: "GET,POST,PUT,DELETE",
//         credentials: true,
//     })
// )
app.use('/api/v1/auth', routes);



passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {
    UserModel.findById(id, function (err, user) {
        done(err, user);
    });
});


const port = process.env.PORT ||3001 ;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
