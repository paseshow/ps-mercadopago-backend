const Router = require('express');
const router = Router();
const passport = require('passport');

const { generatedTokenPaseshow, generateHash } = require('../services/authenticationService');

router.post('/', passport.authenticate('local', { failureRedirect: '/error' }),
    function (req, res) {
        generatedTokenPaseshow(req.body.username, req.body.password, res);
    });

router.post('/create', (req, res) => {
    try {
        generateHash(req.body.username, req.body.password);
    } catch (error) {
        res.status(500);
        return res.json(error);
    }
});

module.exports = router;
