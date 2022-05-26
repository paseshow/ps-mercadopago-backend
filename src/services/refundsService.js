function refunds(res, jsonRequest, reference) {
    mercadopago.payment.refund(jsonRequest.idTransaccion)
        .then(response => {
            console.log('mercadopago.payment.refund SUCCESS: ', jsonRequest.idTransaccion);

            let set = `statusReference = "refunded"`;
            let where = `idTransaccionMp = ${jsonRequest.idTransaccion}`;

            methodsDataBases.UpdateData('reservaReferenceMp', set, where).then(
                resultUpdateReference => {
                    console.log('methodsDataBases.UpdateData reservaReferenceMp SUCCESS: ', reference.reservaId);

                    set = `estado='A'`;
                    methodsDataBases.Update('reservas', set, reference.reservaId).then(
                        resultUpdataReserva => {
                            console.log('methodsDataBases.Update reservas SUCCESS: ', reference.reservaId);

                            let reservaId = reference.reservaId;
                            let fechaDevolucion = new Date().getTime();
                            let usuarioEncargadoId = jsonRequest.idUser;
                            let motivo = jsonRequest.motivo;
                            let monto = jsonRequest.monto;

                            methodsDataBases.Insert('devoluciones', { reservaId, motivo, fechaDevolucion, usuarioEncargadoId, monto }).then(resultInsertDevolucion => {
                                console.log('methodsDataBases.Insert devoluciones SUCCESS. ');
                                console.log("DEVOLUCION EXITOSA, RESERVA: " + reference.reservaId);
                                console.log("------------- The end path POST: refounds/ ");
                                res.status(200);
                                return res.json();
                            });
                        }
                    )
                }).catch(error => {
                    errorsService.errorsService(res, error, "methodsDataBases.UpdateData reservaReferenceMp ERROR.");
                });
        }).catch(error => {
            errorsService.errorsService(res, error, "mercadopago.payment.refund ERROR.");
        });
};

function refundsPartial(res, jsonRequest, reserva, reference) {
    mercadopago.payment.refundPartial({ payment_id: jsonRequest.idTransaccion, amount: Number(jsonRequest.montoParcial) })
        .then(function (response) {
            console.log('mercadopago.payment.refundPartial SUCCESS.' + jsonRequest.idTransaccion);

            let montoUpdate = reserva.importeTotal - jsonRequest.montoParcial;
            let set = montoUpdate != 0 ? `importeTotal = ${montoUpdate}` : `estado='A'`;
            let where = `id = ${reference.reservaId}`;

            methodsDataBases.UpdateData('reservas', set, where).then(
                resultUpdate => {
                    console.log('methodsDataBases.UpdateData reservas SUCCESS.');

                    let reservaId = reference.reservaId;
                    let fechaDevolucion = new Date().getTime();
                    let usuarioEncargadoId = jsonRequest.idUser;
                    let motivo = jsonRequest.motivo;
                    let monto = jsonRequest.montoParcial;

                    methodsDataBases.Insert('devoluciones', { reservaId, motivo, fechaDevolucion, usuarioEncargadoId, monto }).then(resultInsertDevolucion => {
                        console.log('methodsDataBases.Insert devoluciones SUCCESS. ');

                        console.log("DEVOLUCION PARCIAL EXITOSA, RESERVA: " + reference.reservaId);
                        console.log("------------- The end path POST: refounds/partial ");
                        res.status(200);
                        return res.json();
                    });
                });

        }).catch(function (error) {
            errorsService.errorsService(res, error, "mercadopago.payment.refundPartial ERROR.");
        });
};

module.exports = {
    refunds,
    refundsPartial
}