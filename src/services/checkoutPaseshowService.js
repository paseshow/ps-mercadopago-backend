const axios = require('axios');
const mercadopago = require('mercadopago');
const checkoutMercadoPago = require('../services/checkoutMercadoPagoService');
const { Insert, findByFieldSpecific } = require('../config/dataBase');

async function validReservaId(token, reservaId, eventoId, res, req) {

    // OBTENEMOS LOS DATOS DE LA RESERVA
    await axios.get(process.env.URL_PASESHOW + `/reservas/${reservaId}/full?token=${token}`)
        .then(function (response) {

            let reservaById = response.data;

            if (reservaById) {

                try {
                    findByFieldSpecific('reservaReferenceMp', 'reservaId', reservaById.id).then(
                        values => {

                            if (values.length == "0") {

                                findByFieldSpecific('securityMercadoPago', 'eventoId', eventoId).then(
                                    values => {
                                        if (values.length > 0) {

                                            mercadopago.configurations.setAccessToken(values[values.length - 1].accessToken);

                                            mercadopago.preferences.create(checkoutMercadoPago.createPreferences(reservaById))
                                                .then(function (response) {
                                                    let reservaId = reservaById.id;
                                                    let referenceId = response.body.id;
                                                    let clientMpId = response.body.client_id;
                                                    let collectorId = response.body.collector_id;
                                                    let statusReference = "pending";

                                                    let data = { reservaId, referenceId, clientMpId, collectorId, statusReference };
                                                    Insert('reservaReferenceMp', data).then(result => {
                                                        req.app.get("socketService").emiter('event', data);

                                                        let id = reservaById.id;
                                                        let tipo = reservaById.tipo;
                                                        let importeTotal = reservaById.importeTotal;
                                                        let importeTotalNeto = reservaById.importeTotalNeto;
                                                        let serviceChargeTotal = reservaById.serviceChargeTotal;
                                                        let estado = reservaById.estado;
                                                        let boleteria = reservaById.boleteria;
                                                        let fechaReserva = +reservaById.fechaReserva;
                                                        let fechaFacturacion = reservaById.fechaFacturacion;
                                                        let turnoId = null;
                                                        let clienteDni = reservaById.clienteId.dni;
                                                        let clienteNombre = reservaById.clienteId.nombre;
                                                        let clienteEmail = reservaById.clienteId.clienteEmail;
                                                        let reservaPreferenceMpId = result.insertId;

                                                        for (let i = 0; i < reservaById.ubicacionEventoes.length; i++) {

                                                            let ubicacionEventoId = reservaById.ubicacionEventoes[i].id;
                                                            let ubicacionEventoEstado = reservaById.ubicacionEventoes[i].estado;
                                                            let ubicacionEventoFechaIngreso = reservaById.ubicacionEventoes[i].fechaIngreso;
                                                            let sectorEventoDescripcion = reservaById.ubicacionEventoes[i].sectorEventoId.descripcion;
                                                            let sectorEventoFechaFuncion = reservaById.ubicacionEventoes[i].sectorEventoId.fechaFuncion;
                                                            let descuentoSectorDescripcion = reservaById.ubicacionEventoes[i].descuentoSectorId.descripcion;
                                                            let eventoId = reservaById.ubicacionEventoes[i].sectorEventoId.eventoId.id;
                                                            let eventoNombre = reservaById.ubicacionEventoes[i].sectorEventoId.eventoId.nombre;

                                                            Insert('reservas', {
                                                                id, tipo, importeTotal, importeTotalNeto, serviceChargeTotal, estado, boleteria, fechaReserva,
                                                                fechaFacturacion, turnoId, clienteDni, clienteNombre, clienteEmail, reservaPreferenceMpId, eventoId, eventoNombre, ubicacionEventoId,
                                                                ubicacionEventoEstado, ubicacionEventoFechaIngreso, sectorEventoDescripcion, sectorEventoFechaFuncion, descuentoSectorDescripcion
                                                            } ).then(result => {
                                                            })
                                                        }
                                                        console.log(`created reference of reserva_id: ${reservaById.id}`);
                                                        return res.json(
                                                            {
                                                                id: response.body.id ,
                                                                publicKey: values[values.length - 1].publicKey
                                                            });
                                                    });

                                                }).catch(function (error) {
                                                    console.log(`Error methods preferences.create : ${error}`);
                                                });
                                        } else {
                                            res.status(500);
                                            return res.json({ error: 'access token not exists' });
                                        }
                                    }
                                )
                            } else {
                                res.status(500);
                                return res.json({ error: 'Reserva ya existente' });
                            }
                        }
                    );
                } catch {

                }
            }
        })
        .catch(function (error) {
            console.log(`Erro al obtener datos de la reserva ${reservaId}: ${error}`);
            res.status(500);
            res.json({ error: 'server Paseshow' });
        })
        .finally(function () {

        });
};

async function getEventoes(token, res) {

    await axios.get(process.env.URL_PASESHOW + `eventoes?token=${token}`)
        .then(
            function (response) {
                return res.json(response.data);
            })
        .catch(function (error) {
            console.log(resultListEventoes);
        });

};

async function notifcationsReservaApproved(reservaId) {

    
};

module.exports = {
    validReservaId,
    getEventoes,
    notifcationsReservaApproved
}