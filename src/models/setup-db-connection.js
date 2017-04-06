import { mongoDriver } from 'simple-odm'
import config from '../config';

mongoDriver.setUp({
    host: config.getValue('dbHost'),
    port: config.getValue('dbPort'),
    database: config.getValue('dbName')
});