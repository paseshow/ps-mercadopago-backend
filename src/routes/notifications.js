const Router = require('express');
const router = Router();
const checkoutMercadoPago = require('../services/checkoutMercadoPagoService');
const checkoutPaseshowService = require('../services/checkoutPaseshowService');

router.post('', (req, res) => {

    try {

        let queryReq = req.query;
        let type = null;
        let id = null;

        for (let value in queryReq) {

            if (value == "type" || value == "topic")
                type = queryReq[value];

            else if (value.includes("id"))
                id = queryReq[value];
        }
        if (type == 'payment') {
            // pagos recibidos
            checkoutMercadoPago.getPaymentsById(id).then(exit => {
                checkoutPaseshowService.notifcationsReservaApproved(exit, req, res);
            });
        } else if (type == 'chargebacks') {
            //https://api.mercadopago.com/v1/chargebacks/{id}
            // devoluciones de cargo recibidas
            console.log('chargebacks ' + id);

            res.status(200);
            return res.json();
        } else {
            //merchant_order: orden para pagar
            //  checkoutMercadoPago.getPaymentsById(id);

            res.status(200);
            return res.json();

        }
    } catch (error) {
        res.status(400).json({ error });
    }
});


module.exports = router;