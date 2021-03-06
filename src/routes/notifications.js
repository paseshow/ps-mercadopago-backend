const Router = require('express');
const router = Router();
const checkoutMercadoPago = require('../services/checkoutMercadoPagoService');
const checkoutPaseshowService = require('../services/checkoutPaseshowService');

router.post('/:nombreCuenta', (req, res) => {

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
            checkoutMercadoPago.getPaymentsById(id, req).then(exit => {

                if(exit.data.status == "approved") {
                    checkoutPaseshowService.notifcationsReservaApproved(exit, req, res);
                }

            });

            res.status(200);
            return res.json();
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

router.get('/exit', (req, res) => {
    return res.writeHead(301, {
        Location: `${process.env.URL_PASESHOW}#/pago-exito`
    }).end();
});

router.get('/fail', (req, res) => {
    return res.writeHead(301, {
        Location: `${process.env.URL_PASESHOW}#/pago-error`
    }).end();
});

router.get('/pending', (req, res) => {
    return  res.writeHead(301, {
        Location: `${process.env.URL_PASESHOW}#/pago-error`
    }).end();
});


module.exports = router;
