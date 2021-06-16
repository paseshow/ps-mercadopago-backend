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

                    mercadopago.payment.refund(jsonRequest.idTransaccion)
                        .then(response => {
                            let set = `statusReference = "refunded"`;
                            let where = `idTransaccionMp = ${jsonRequest.idTransaccion}`;

                            methodsDataBases.UpdateData('reservaReferenceMp', set, where).then(
                                resultUpdateReference => {
                                    set = `estado='A'`;
                                    methodsDataBases.Update('reservas', set, resultQueryReference[0].reservaId).then(
                                        resultUpdataReserva => {
                                            let reservaId = resultQueryReference[0].reservaId;
                                            let fechaDevolucion = new Date().getTime();
                                            let usuarioEncargadoId = jsonRequest.idUser;
                                            let motivo = jsonRequest.motivo;
                                            let monto = jsonRequest.monto;

                                            methodsDataBases.Insert('devoluciones', { reservaId, motivo, fechaDevolucion, usuarioEncargadoId, monto }).then(resultInsertDevolucion => {

                                                console.log("DEVOLUCION EXITOSA, RESERVA: " + resultQueryReference[0].reservaId);
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
                });
        });
});

router.get('/:reservaId', (req, res) => {
    methodsDataBases.findByFieldSpecific('reservaReferenceMp', 'reservaId', req.params.reservaId).then(
        resultFindReference => {
            return res.json(resultFindReference[0]);
        }).catch(error => {
            console.log(error);
            return res.status(500);
        });
});

router.post('/partial', (req, res) => {

    let jsonRequest = req.body.body;

    methodsDataBases.findByFieldSpecific('reservaReferenceMp', 'idTransaccionMp', jsonRequest.idTransaccion).then(
        resultQueryReference => {
            if (!resultQueryReference) return res.status(500);

            methodsDataBases.findByFieldSpecific('securityMercadoPago', 'userIdMp', resultQueryReference[0].collectorId).then(
                resultFindSecurity => {
                    mercadopago.configure({
                        access_token: resultFindSecurity[0].accessToken
                    });

                    mercadopago.payment.refundPartial({ payment_id: jsonRequest.idTransaccion, amount: Number(jsonRequest.montoParcial) })
                        .then(function (response) {
                            console.log(response);
                            methodsDataBases.findByFieldSpecific('reservas', 'id', resultQueryReference[0].reservaId)
                                .then(resultFindReserva => {
                                    let set = `importeTotal = ${resultFindReserva[0].importeTotal - jsonRequest.montoParcial}`;
                                    let where = `id = ${resultQueryReference[0].reservaId}`;
                                    methodsDataBases.UpdateData('reservas', set, where).then(
                                        resultUpdate => {

                                            let reservaId = resultQueryReference[0].reservaId;
                                            let fechaDevolucion = new Date().getTime();
                                            let usuarioEncargadoId = jsonRequest.idUser;
                                            let motivo = jsonRequest.motivo;
                                            let monto = jsonRequest.montoParcial;

                                            methodsDataBases.Insert('devoluciones', { reservaId, motivo, fechaDevolucion, usuarioEncargadoId, monto }).then(resultInsertDevolucion => {

                                                console.log("DEVOLUCION PARCIAL EXITOSA, RESERVA: " + responseFindById.body.external_reference);
                                                res.status(200);
                                                return res.json();
                                            });
                                        });
                                }).catch(function (error) {
                                    console.log(error);
                                    res.status(500);
                                    return res.json({});
                                });
                        })
                        .catch(function (error) {
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

module.exports = router;