const axios = require('axios');
const mercadopago = require('mercadopago'); 
const checkoutMercadoPago = require('../services/checkoutMercadoPagoService');
const { Insert, findByFieldSpecific, UpdateEstadoReserva } = require('../config/dataBase');

async function validReservaId(reservaId, eventoId, res, req) {

    // OBTENEMOS LOS DATOS DE LA RESERVA
    await axios.get(process.env.URL_PASESHOW + `/reservas/${reservaId}/full?token=${process.env.TOKEN}`)
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
                                                            }).then(result => {
                                                            })
                                                        }
                                                        console.log(`created reference of reserva_id: ${reservaById.id}`);
                                                        return res.json(
                                                            {
                                                                id: response.body.id,
                                                                publicKey: values[values.length - 1].publicKey
                                                            });
                                                    });

                                                }).catch(function (error) {
                                                    console.log(`Error methods preferences.create : ${error}`);
                                                });
                                        } else res.status(500).json({ error: 'access token not exists' });
                                    });
                            } else res.status(500).json({ error: 'Reserva ya existente' });
                        });
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

// OBTENEMOS LOS EVENTOS DEL BACK DE PASESHOW
async function getEventoes(res) {
    await axios.get(process.env.URL_PASESHOW + `eventoes?token=${process.env.TOKEN}`)
        .then(
            function (response) {
                return res.json(response.data);
            })
        .catch(function (error) {
            console.log(error);
        });
};

// NOTIFICAMOS AL BACK DE PASESHOW QUE SE HIZO EL PAGO CORRECTAMENTE, Y ACTUALIZAMOS LA RESERVA A ESTADO = E
// PARA FINALIZAR ENVIAMOS UN EVENTO A AQUELLOS FRONTEND QUE ESTEN CONECTADOS AL SOCKET CREADO
function notifcationsReservaApproved(reservaId, req, res) {

    findByFieldSpecific('reservas', 'id', reservaId.data.external_reference).then(
        result => {
            let urlPaseshow = `${process.env.URL_PASESHOW}reservas/notificacionmp?token=${process.env.TOKEN}`;
            let data = {
                "id": result[0].id,
                "fecha_notificacion": `${new Date().getTime()}`,
                "estado": 1,
                "importe": result[0].importeTotal
            };

            axios({
                method: 'post',
                url: urlPaseshow,
                headers: {
                    'Content-Type': 'application/json'
                },
                data: data
            }).then(function (responseAxios) {
                UpdateEstadoReserva(result[0].id).then(
                    resultUpdate => {
                        req.app.get("socketService").emiter('event', resultUpdate);
                        console.log("Pago recibido - reserva: " + result[0].id);

                        res.status(200).json({});
                    }
                ).catch(error => {
                    console.log("Error :" + error);
                    res.status(400).json({});
                });

            }).catch(function (error) {
                console.log("Error :" + error);
                res.status(400).json({});
            });
        });
};

module.exports = {
    validReservaId,
    getEventoes,
    notifcationsReservaApproved
}