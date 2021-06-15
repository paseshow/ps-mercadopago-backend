const Router = require('express');
const router = Router();
const passport = require('passport');
const methodsDataBase = require('../config/dataBase');

const { generatedTokenPaseshow, generateHash } = require('../services/authenticationService');

router.post('/', passport.authenticate('local', { failureRedirect: '/error' }),
    function (req, res) {
        methodsDataBase.findByFieldSpecific('usuarios', 'username', req.body.username).then(
            result => {
                generatedTokenPaseshow(req.body.username, req.body.password, res, result[0].id);
            });
    });

router.post('/create', (req, res) => {
    try {
        generateHash(req.body.username, req.body.password);
        res.status(200);
        return res.json();
    } catch (error) {
        res.status(500);
        return res.json(error);
    }
});

router.get('/server', (req, res) => {
    generatedTokenPaseshow(null, null, res, null);
});

module.exports = router;
