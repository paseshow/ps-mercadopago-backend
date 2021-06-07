const { Router } = require('express');
const router = Router();
const { Insert, Update, findById } = require('../config/dataBase');


router.put((''), (req, res) => {

    try {
        let accessToken = req.body.accessToken;
        let publicKey = req.body.publicKey;
        let userIdMp = req.body.userIdMp;
        let nombreCuenta = req.body.nombreCuenta;
        let nombre = req.body.nombre;
        let eventoId = req.body.eventoId;

        Insert('securityMercadoPago', {
            accessToken, publicKey, userIdMp, nombreCuenta, nombre, eventoId
        }).then(result => {
            res.status(200);
           return res.json( { id: result.insertId});
        })
    } catch (error) {
        return res.json({ error: error });
    }
});

router.post(('/update'), (req, res) => {

    try {
        let data =  `id = ${req.body.id},
         accessToken = '${req.body.accessToken}',
         publicKey = '${req.body.publicKey}',
         userIdMp = ${req.body.userIdMp},
         nombreCuenta = '${req.body.nombreCuenta}',
         nombre = '${req.body.nombre}'`;
         
        Update('securityMercadoPago', data, req.body.id).then(result => {
            res.status(200);
            if(result.affectedRows > 0)
           return res.json( 'Exits' );
        })
    } catch (error) {
        return res.json({ error: error });
    }
});

router.get(('/:id'), (req, res) => {

    try {
        findById('securityMercadoPago', 'eventoId', req.params.id).then(
            values => {
                if (values.length > 0) {
                    res.status(200);
                    return res.json(values[values.length - 1]);
                } else {
                    res.status(500);
                    return res.json({ error: 'data not register' });
                }
            }
        )
    }catch (error){
        res.status(400);
        return res.json({"error": error});
    }
});

module.exports = router;