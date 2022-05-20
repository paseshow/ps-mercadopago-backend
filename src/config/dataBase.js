const mysql = require('mysql');
const { rescheduleJob } = require('node-schedule');
const { dataBase } = require('./configServer');

function connect() {
    return mysql.createConnection({
        host: dataBase.host,
        user: dataBase.user,
        password: dataBase.password,
        database: dataBase.database
    });
};

function Insert(table, objectData) {

    return new Promise((resolve, reject) => {
        const connecting = connect();

        connecting.query(`INSERT INTO ${table} SET?`, objectData, (error, result) => {
            if (error) console.log(`ERROR : Insert data into table:${table}, ${error}`);
            else {
                console.log(`SUCCESS: Insert data in ${table} `);
                resolve(result);
            }
        })
    });
};

function Update(table, objectData, id) {

    return new Promise((resolve, reject) => {
        const connecting = connect();

        connecting.query(`UPDATE ${table} SET ${objectData} where id = ${id}`, (error, result) => {
            if (error) console.log(`ERROR : Update data into table:${table}, ${error}`);
            else {
                console.log(`SUCCESS: Update data in ${table} `);
                resolve(result);
            }
        })
    });
};

function UpdateByFieldSpecific(table, objectData, id) {

    return new Promise((resolve, reject) => {
        const connecting = connect();

        connecting.query(`UPDATE ${table} SET ${objectData} where ${id}`, (error, result) => {
            if (error) console.log(`ERROR : UpdateByFieldSpecific data into table:${table}, ${error}`);
            else {
                console.log(`SUCCESS: Update data in ${table} `);
                resolve(result);
            }
        })
    });
};

function findAll(table, limit) {

    return new Promise((resolve, reject) => {

        const connecting = connect();

        connecting.query(`SELECT * FROM ${table} ${limit ? `order by id desc LIMIT ${limit}` : ''}`, (error, result) => {
            if (error) console.log(error);
            else resolve(result);
        });
    });
};

function findByFieldSpecific(table, field, value) {

    return new Promise((resolve, reject) => {
        const connecting = connect();
        connecting.query(`SELECT * FROM ${table} WHERE ${field} = ${value};`, (error, result) => {

            if (error) console.log(error);
            else resolve(result);
        });
    });
};

function findByWhere(table, where) {
    return new Promise((resolve, reject) => {
        const connecting = connect();

        connecting.query(`SELECT * FROM ${table} where ${where}`, (error, result) => {
            if (error) console.log(error);
            else resolve(result);
        });
    })
};

function UpdateEstadoReserva(reservaId, estado) {
    return new Promise((resolve, reject) => {
        const connecting = connect();
        connecting.query(`UPDATE reservas SET estado='${estado}' WHERE id =` + reservaId.toString(), (error, result) => {
            if (error) console.log(error);
            else {
                findByFieldSpecific('reservaReferenceMp', 'reservaId', reservaId).then(
                    result => {
                        resolve(result[0]);
                    }
                )
            }
        });
    });
};

function UpdateData(table, set, where) {

    return new Promise((resolve, reject) => {
        const connecting = connect();
        connecting.query(`UPDATE ${table} SET ${set} WHERE ${where}`, (error , result) => {
            if(error) console.log(error);
            resolve(result);
        });
    });
};

module.exports = {
    connect,
    Insert,
    Update,
    UpdateByFieldSpecific,
    findAll,
    findByFieldSpecific,
    findByWhere,
    UpdateEstadoReserva,
    UpdateData
};