const Router = require('express');
const router = Router();

router.post('', (req, res) => {

    try {

        let topic = req.params.topic; //  tipo de recurso
        let id = req.params.id; // identificador del recurso notificado

        if (topic == 'payment') {
            // pagos recibidos
            console.log('paymeny' + id);
        } else if (topic == 'chargebacks') {
            // devoluciones de cargo recibidas
            console.log('chargebacks' + id);
        } else {
            console.log(id);
        }

        res.status(200);
        return res;

    } catch (error) {
        res.status(400);
        return res.json({ error });
    }
});

module.exports = router;