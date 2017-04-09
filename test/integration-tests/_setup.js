import {mongoDriver} from 'simple-odm';
import {settings} from './_data';

export const weblogjs = require("../../src/app");

const config = require("../../src/config");

weblogjs.init(settings);

mongoDriver.setUp({
    database: config.getValue('dbName')
});

//export const ADMIN_URL = `http://${webHost}:${webPort}${adminApiRoot}`;
//export const login = () => httpRequest.post(`${ADMIN_URL}/login`, admin);
//export const logout = () => httpRequest.get(`${ADMIN_URL}/logout`);
