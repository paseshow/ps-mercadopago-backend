const Router = require('express');
const router = Router();
const checkoutMercadoPago = require('../services/checkoutMercadoPagoService');

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
            try {
                checkoutMercadoPago.getPaymentsById(id, req);

                res.status(200);
                return res.json();

            } catch (error) {
                console.log('Error notifications payments: ' + error);
            }
        } else if (type == 'chargebacks') {
            //https://api.mercadopago.com/v1/chargebacks/{id}
            // devoluciones de cargo recibidas
            console.log('chargebacks ' + id);

            res.status(200);
            return res.json();
        } else {
            //merchant_order: orden para pagar
            try {
                //  checkoutMercadoPago.getPaymentsById(id);

                res.status(200);
                return res.json();
            } catch (error) {
                console.log('Error notifications merchant_order: ' + error);
            }

        }

    } catch (error) {
        res.status(400);
        return res.json({ error });
    }
});

module.exports = router;