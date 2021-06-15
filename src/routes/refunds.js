const Router = require('express');
const router = Router();
const mercadopago = require('mercadopago');
const methodsDataBases = require('../config/dataBase');

router.post('/cancelled/:paymentId', (req, res) => {
    mercadopago.configure({
        access_token: 'TEST-7765143967393000-042116-2389ef370f47350b7f5e67264c54d03c-456584334'
    });

    mercadopago.payment.update({
        id: req.params.paymentId,
        status: 'cancelled'
    }).then(
        result => {
            console.log(result);
        }).catch(error => {
            console.log(error);
            res.status(500);
            res.json({});
        })
});

router.post('/', (req, res) => {
    let jsonRequest = req.body.body;
    methodsDataBases.findByFieldSpecific('reservaReferenceMp', 'idTransaccionMp', jsonRequest.idTransaccion).then(
        resultQueryReference => {
            if (!resultQueryReference) return res.status(500);

            methodsDataBases.findByFieldSpecific('securityMercadoPago', 'userIdMp', resultQueryReference[0].collectorId).then(
                resultFindSecurity => {
                    mercadopago.configure({
                        access_token: resultFindSecurity[0].accessToken
                    });

                    mercadopago.payment.findById(jsonRequest.idTransaccion)
                        .then(responseFindById => {

                            mercadopago.payment.refund(jsonRequest.idTransaccion)
                                .then(response => {
                                    let set = `statusReference = "refunded"`;
                                    let where = `idTransaccionMp = ${jsonRequest.idTransaccion}`;

                                    methodsDataBases.UpdateData('reservaReferenceMp', set, where).then(
                                        resultUpdateReference => {
                                            set = `estado='A'`;
                                            methodsDataBases.Update('reservas', set, responseFindById.body.external_reference).then(
                                                resultUpdataReserva => {
                                                    let reservaId = responseFindById.body.external_reference;
                                                    let fechaDevolucion = new Date().getTime();
                                                    let usuarioEncargadoId = jsonRequest.idUser;
                                                    let motivo = jsonRequest.motivo;

                                                    methodsDataBases.Insert('devoluciones', { reservaId, motivo, fechaDevolucion, usuarioEncargadoId }).then( resultInsertDevolucion => {

                                                        console.log("DEVOLUCION EXITOSA, RESERVA: " + responseFindById.body.external_reference);
                                                        res.status(200);
                                                        res.json();
                                                    });
                                                }
                                            )
                                        }).catch(error => {
                                            console.log(error);
                                            res.status(500);
                                            return res.json({});
                                        });
                                }).catch(error => {
                                    console.log(error);
                                    res.status(500);
                                    return res.json({});
                                });
                        }).catch(error => {
                            console.log(error);
                            res.status(500);
                            return res.json({});
                        });
                });
        });
});

router.get('/:reservaId', (req, res) => {
    methodsDataBases.findByFieldSpecific('reservaReferenceMp', 'reservaId', req.params.reservaId).then(
        resultFindReference => {
            return res.json(resultFindReference[0]);
        }).catch( error => {
            console.log(error);
            return res.status(500);
        });
});

module.exports = router;