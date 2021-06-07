const axios = require('axios');
var qs = require('qs');
const bcrypt = require('bcrypt');
const { Insert } = require('../config/dataBase');

const saltRounds = 10;


function validAuthentication(req, res, next) {
    if (req.isAuthenticated())
        return next()

    res.redirect('authentication');
};

async function generatedTokenPaseshow(username, password, res) {

    urlPaseshow = `${process.env.URL_PASESHOW}usuarios/authenticate`;

    var data = qs.stringify({
        'password': password,
        'username': username
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
            return res.json(response.data);
        })
        .catch(function (error) {
            console.log(error)
        })
};

function generateHash(username, password) {
    console.log(password);

    bcrypt.hash(password, saltRounds, function(err, hash) {
        let pass = hash;
        console.log(pass);

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