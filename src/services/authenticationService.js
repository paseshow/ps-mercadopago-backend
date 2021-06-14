const axios = require('axios');
const qs = require('qs');
const bcrypt = require('bcrypt');
const { Insert } = require('../config/dataBase');
const saltRounds = 10;


function validAuthentication(req, res, next) {
    if (req.isAuthenticated())
        return next()

    res.redirect('authentication');
};

async function generatedTokenPaseshow(username, password, res) {

    let urlPaseshow = `${process.env.URL_PASESHOW}usuarios/authenticate`;

    let data = qs.stringify({
        'password': password ? password : 'miguel01',
        'username': username ? username : '25858046'
    });

    await axios(
        {
            method: 'post',
            url: urlPaseshow,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            data: data
        })
        .then(function (response) {
            process.env.TOKEN = response.data.token;
            return res ? res.json(response.data) :  null;
        })
        .catch(function (error) {
            console.log(error)
        })
};

function generateHash(username, password) {
    bcrypt.hash(password, saltRounds, function(err, hash) {
        let pass = hash;
        Insert('usuarios', { username, pass }).then(
            result => {
            }
        )
    });
};

function validPassword(pass, password) {

};

module.exports = {
    validAuthentication,
    generatedTokenPaseshow,
    generateHash,
    validPassword
}