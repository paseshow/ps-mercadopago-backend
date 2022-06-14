const axios = require('axios');
const mercadopago = require('mercadopago'); 
const checkoutMercadoPago = require('../services/checkoutMercadoPagoService');
const { Insert, findByFieldSpecific, UpdateEstadoReserva } = require('../config/dataBase');

async function validReservaId(reservaId, eventoId, res, req) {

    // OBTENEMOS LOS DATOS DE LA RESERVA
    await axios.get(process.env.URL_PASESHOW + `/reservas/${reservaId}/full`, { 'headers': {'X-Auth-Token' : process.env.TOKEN}})
        .then(function (response) {
            let reservaById = response.data;
            console.log(`axion get /reservas/${reservaId}/full SUCCESS. `);

            if (reservaById) {
                try {
                    findByFieldSpecific('reservaReferenceMp', 'reservaId', reservaById.id).then(
                        values => {
                            console.log('methodsDataBases.findByFieldSpecific reservaReferenceMp SUCCESS.');

                            if (values.length == "0") {
                                findByFieldSpecific('securityMercadoPago', 'eventoId', eventoId).then(
                                    values => {
                                        console.log('methodsDataBases.securityMercadoPago reservaReferenceMp SUCCESS.');

                                        if (values.length > 0) {
                                            mercadopago.configurations.setAccessToken(values[values.length - 1].accessToken);

                                            mercadopago.preferences.create(checkoutMercadoPago.createPreferences(reservaById, values[values.length - 1].nombreCuenta))
                                                .then(function (response) {
                                                    console.log('mercadopago.preferences.create SUCCESS.');

                                                    let reservaId = reservaById.id;
                                                    let referenceId = response.body.id;
                                                    let clientMpId = response.body.client_id;
                                                    let collectorId = response.body.collector_id;
                                                    let statusReference = "pending";

                                                    let data = { reservaId, referenceId, clientMpId, collectorId, statusReference };
                                                    Insert('reservaReferenceMp', data).then(result => {
                                                        console.log('insert reservaReferenceMp SUCCESS.');
                                                        
                                                        req.app.get("socketService").emiter('event', data);

                                                        let id = reservaById.id;
                                                        let tipo = reservaById.tipo;
                                                        let importeTotal = reservaById.importeTotal;
                                                        let importeTotalNeto = reservaById.importeTotalNeto;
                                                        let serviceChargeTotal = reservaById.serviceChargeTotal;
                                                        let estado = "P";
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
                                                                console.log('insert reservaReferenceMp SUCCESS.');
                                                            })
                                                        }
                                                        console.log(`created reference of reserva_id: ${reservaById.id}`);
                                                        console.log("------------- The end path POST: checkout/create_preferences/" + eventoId);
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
async function getEventoes(token,res) {
    await axios.get(process.env.URL_PASESHOW + `eventoes`, { 'headers': {'X-Auth-Token' : process.env.TOKEN}})
        .then(
            function (response) {
                console.log("api axios get: eventoes SUCESS.");
                return res.json(response.data);
            })
        .catch(function (error) {
            console.log("api axios get: eventoes ERROR.");
            console.log(error);
        });
};

// NOTIFICAMOS AL BACK DE PASESHOW QUE SE HIZO EL PAGO CORRECTAMENTE, Y ACTUALIZAMOS LA RESERVA A ESTADO = E
// PARA FINALIZAR ENVIAMOS UN EVENTO A AQUELLOS FRONTEND QUE ESTEN CONECTADOS AL SOCKET CREADO
function notifcationsReservaApproved(reservaId, req, res) {

    findByFieldSpecific('reservas', 'id', reservaId.data.external_reference).then(
        result => {
            let urlPaseshow = `${process.env.URL_PASESHOW}reservas/notificacionmp`;
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
                    'Content-Type': 'application/json',
                    'X-Auth-Token' : process.env.TOKEN
                },
                data: data
            }).then(function (responseAxios) {
                UpdateEstadoReserva(result[0].id, 'E').then(
                    resultUpdate => {
                        req.app.get("socketService").emiter('event', resultUpdate);
                        console.log("Pago recibido - reserva: " + result[0].id);

                        res.status(200);
                        res.json({});
                    }
                ).catch(error => {
                    console.log("Error :" + error);
                    res.status(400);
                    res.json({});
                });

            }).catch(function (error) {
                console.log("Error :" + error);
                res.status(400);
                res.json({});
            });
        });
};

module.exports = {
    validReservaId,
    getEventoes,
    notifcationsReservaApproved
}