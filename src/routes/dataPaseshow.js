const Router = require('express');
const router = Router();

const checkoutPaseshowService = require('../services/checkoutPaseshowService');

router.get('', (req, res) => {

    try {
        console.log("------------- Init path GET: eventoes/ ")
        checkoutPaseshowService.getEventoes(req.query.token, res);
    } catch (error) {
        res.status(500);
        res.json({ error: `${error}` });
    }

});

module.exports = router;