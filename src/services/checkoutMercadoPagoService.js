
function createPreferences(requestBody) {
    
    let preferences = {
        items: [
            {
                title: 'PaseShow',
                unit_price: requestBody.importeTotal,
                quantity: 1
            }
        ],
        back_urls: {
            "success": "http://localhost:8080/#/operacion-mercado-pago-info",
            "failure": "https://www.paseshow.com.ar/fail_mercadopago",
            "pending": "https://www.paseshow.com.ar/pending_mercadopago"
        },
        auto_return: 'approved',
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
        notification_url: "https://www.your-site.com/ipn", // notificaiones para estados de los procesos
        statement_descriptor: "PaseShow", //descripcion que aparecera en el resumen de tarjeta del comprador
        external_reference: requestBody.id.toString(),
    };

    return preferences;
}

module.exports = {
    createPreferences
}