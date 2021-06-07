const Router = require('express');
const router = Router();

const { findByWhere } = require('../config/dataBase');

router.put((''), (req, res) => {

    try {
        let where = '';

        for(let key in req.body.where) {
            if(req.body.where[key] != "") {
                where = where.concat(key + ' = ' + req.body.where[key] + ' and ');
            }
        }

        where = where.slice(0, where.length -5);

        findByWhere('reservas',where).then(
            result => {
                return res.json(result);
            }
        )

    } catch(error) {
        res.status(500);
        return res.json(error);
    }

});

module.exports = router;