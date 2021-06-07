const ConfigServer = {
    appConfig: {
        port: process.env.APP_PORT
    },
    dataBase: {
        host: process.env.HOST_DB,
        port: process.env.PORT_DB,
        database: process.env.NAME_DB,
        user: process.env.USER_DB,
        password: process.env.PASSWORD_DB
    }
};

module.exports = ConfigServer;