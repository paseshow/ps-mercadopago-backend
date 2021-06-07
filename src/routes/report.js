const { Router } = require('express');
const router = Router();

const { findAll, findById } = require('../config/dataBase');
const { validAuthentication } = require('../services/authenticationService');

router.get('/reservas', (req, res, next) => { validAuthentication(req, res, next) }, (req, res) => {

    findAll('reservaReferenceMp', req.params.limit ? req.params.limit : null).then(
        result => {
            return res.json(result);
        }
    );

});

router.get('/reservas/:id', (req, res) => {

    findById('reservaReferenceMp', 'reservaId', req.params.id).then(
        result => {
            return res.json(result[0]);
        }
    )

});

module.exports = router;