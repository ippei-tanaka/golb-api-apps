import {mongoDriver} from 'simple-odm'

export default ({dbHost, dbPort, dbName}) =>
    mongoDriver.setUp({
        host: dbHost,
        port: dbPort,
        database: dbName
    });