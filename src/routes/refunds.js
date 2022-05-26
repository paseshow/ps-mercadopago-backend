const Router = require('express');
const router = Router();
const mercadopago = require('mercadopago');
const methodsDataBases = require('../config/dataBase');
const errorsService = require('../services/errorsService');
const { refunds, refundsPartial } = require('../services/refundsService');

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
    console.log("------------- Init path POST: refounds/ ");
    let jsonRequest = req.body.body;

    methodsDataBases.findByFieldSpecific('reservaReferenceMp', 'idTransaccionMp', jsonRequest.idTransaccion).then(
        resultQueryReference => {

            if (!resultQueryReference) return res.status(500);

            console.log('methodsDataBases.findByFieldSpecific reservaReferenceMp SUCCESS.');

            methodsDataBases.findByFieldSpecific('reservas', 'id', resultQueryReference[0].reservaId)
                .then(resultFindReserva => {
                    console.log('methodsDataBases.findByFieldSpecific reservas SUCCESS.');

                    let where = `userIdMp = ${resultQueryReference[0].collectorId} AND eventoId = ${jsonRequest.eventoId}`;

                    methodsDataBases.findByWhere('securityMercadoPago', where).then(
                        resultFindSecurity => {
                            console.log('methodsDataBases.findByFieldSpecific securityMercadoPago SUCCESS.');

                            mercadopago.configure({
                                access_token: resultFindSecurity[0].accessToken
                            });

                            if(resultFindReserva.importeTotal > jsonRequest.monto) {
                                console.log("refunds Parcial");
                                refundsPartial(res, jsonRequest, resultFindReserva[0], resultQueryReference);
                            } else {
                                console.log("refunds Total");
                                refunds(res, jsonRequest, resultQueryReference[0]);
                            }

                        }).catch(error => {
                            errorsService.errorsService(res, error, "methodsDataBases.UpdateData securityMercadoPago ERROR.");
                        });
                }).catch(function (error) {
                    errorsService.errorsService(res, error, "methodsDataBases.findByFieldSpecific reservas ERROR.");
                });


        }).catch(error => {
            errorsService.errorsService(res, error, "methodsDataBases.findByFieldSpecific reservaReferenceMp ERROR.");
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

module.exports = router;