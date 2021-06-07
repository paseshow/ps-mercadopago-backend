require('dotenv').config();

const express = require('express');
const app = express();

// LOGIN, REGISTRO USUARIOS  ------------------------------
const session = require('express-session');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const PassportLocal = require('passport-local').Strategy;

const bcrypt = require('bcrypt');
// -------------------------------------------------------

const cors = require('cors');
const { appConfig } = require('./src/config/configServer');

// RUTAS  ----------------------------------------------------------
const routerCheckout = require('./src/routes/checkout');
const routerReport = require('./src/routes/report');
const routerDataPaseshow = require('./src/routes/dataPaseshow');
const routerSecurityMp = require('./src/routes/securityMp');
const routerNotificactionsMp = require('./src/routes/notifications');
const routerReservas = require('./src/routes/reservas');
const routerAuthentication = require('./src/routes/authentication');
// ------------------------------------------------------------------


const { findById } = require('./src/config/dataBase');

const SocketService = require('./src/config/socketIo');

const isTest = true;

app.use(cors());
app.use(express.json());
app.use(cookieParser('64d8291b-5ede-4a81-8c29-4decf35f4b85'));
app.use(session({
    secret: '64d8291b-5ede-4a81-8c29-4decf35f4b85',
    resave: true,
    saveUninitialized: true,
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new PassportLocal(function (username, password, done) {
    findById('usuarios', 'username', username).then(
        resultFind => {
            bcrypt.compare(password, resultFind[0].pass, function(err, result) {
                if(result) {
                    return done(null, { id: resultFind[0].id, name: resultFind[0].username.toString() });
                } else {
                    done(null, false);
                }
            });
        }
    );
}));

passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {
    findById('usuarios', 'id', id).then(
        result => {
            done(null, { id: result[0].id, name: result[0].username.toString() });
        }
    )
});

app.use('/checkout', routerCheckout);
app.use('/report', routerReport);
app.use('/eventoes', routerDataPaseshow);
app.use('/security', routerSecurityMp);
app.use('/notifications', routerNotificactionsMp);
app.use('/reservas', routerReservas);
app.use('/authentication', routerAuthentication);

app.use('/views', express.static('./src/views'));


const server = require('http').Server(app);

server.listen(appConfig.port, () => {
    if (isTest) {
        process.env.URL_PASESHOW = 'https://www.paseshow.com.ar/test/';
    }
    console.log(`${isTest ? 'TEST' : 'PROD'} - Server run port: ${appConfig.port}`)
});

app.set("socketService", new SocketService(server));