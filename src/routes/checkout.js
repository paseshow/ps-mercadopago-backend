const { Router } = require('express');
const router = Router();

const checkoutPaseshowService = require('../services/checkoutPaseshowService');

router.post('/create_preferences/:eventoId', (req, res) => {
    
    try  {
        console.log("------------- Init path POST: checkout/create_preferences/" + req.params.eventoId);
        checkoutPaseshowService.validReservaId(req.body.reservaId.toString(), req.params.eventoId, res, req);
    } catch(e) {
        res.status(500);
        res.json({ error: 'server' });
    }

});


module.exports = router;