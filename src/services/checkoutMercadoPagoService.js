const axios = require('axios');
const { findByFieldSpecific, UpdateByFieldSpecific, UpdateEstadoReserva } = require('../config/dataBase');

function createPreferences(requestBody, nombreCuenta) {

    let preferences = {
        items: [
            {
                title: 'PaseShow',
                unit_price: requestBody.importeTotal,
                quantity: 1
            }
        ],
        back_urls: {
            "success": "https://www.paseshow.com.ar/test/#/operacion-mercado-pago-info",
            "failure": "https://www.paseshow.com.ar/fail_mercadopago",
            "pending": "https://www.paseshow.com.ar/pending_mercadopago"
        },
        payer: {
            "name": requestBody.clienteId.nombre,
            "surname": requestBody.clienteId.username,
            "email": requestBody.clienteId.email,
            "phone": {
                "area_code": "+",
                "number": Number(requestBody.clienteId.telefono)
            },
            "identification": {
                "type": "DNI",
                "number": requestBody.clienteId.dni
            },
            "address": {
                "street_name": requestBody.clienteId.direccion,
                "street_number": 0,
                "zip_code": requestBody.clienteId.cp
            }
        },
        notification_url: "https://api2.test.mercadopago.paseshow.com.ar/notifications/" + nombreCuenta, // notificaiones para estados de los procesos
        statement_descriptor: "PaseShow", //descripcion que aparecera en el resumen de tarjeta del comprador
        external_reference: requestBody.id.toString(),
    };

    return preferences;
}

function getPaymentsById(paymentId, req) {

    return new Promise((resolve, reject) => {

        try {
            findByFieldSpecific('securityMercadoPago', 'nombreCuenta', `"${req.params.nombreCuenta}"`).then(
                result => {
                    axios.get(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
                        headers: {
                            'Authorization': `Bearer ${result[result.length -1].accessToken}`
                        }
                    })
                        .then((response) => {
                               console.log("------- payments: ", response.toString()); 
                            let data = `statusReference = '${response.data.status}' , idTransaccionMp=${response.data.id}`;
                            let where = `reservaId = ${response.data.external_reference}`;

                            UpdateByFieldSpecific('reservaReferenceMp', data, where).then(
                                result => {
                                    findByFieldSpecific('reservaReferenceMp', 'reservaId', response.data.external_reference).then(
                                        resultReserva => {
                                            resolve(response);
                                        });
                                });
                            

                            let estado = 'P'; 
                            if(response.data.status == "approved") {
                                estado = 'E';
                            } else if(response.data.status == "rejected") {
                                estado = 'R';
                            }

                            UpdateEstadoReserva(response.data.external_reference, estado).then(
                              resultUpdate => {
                                  req.app.get("socketService").emiter('event', resultUpdate);
                              }).catch(error => {
                                console.log("Error :" + error);
                              });
                        })
                        .catch(error => {
                            console.log(error);
                        })
                        .finally();
                }
            );

        } catch (error) {
            console.log(error);
        }
    })
};

function getMerchantOrder(merchantOrderId) {

};

module.exports = {
    createPreferences,
    getPaymentsById,
    getMerchantOrder,
}
