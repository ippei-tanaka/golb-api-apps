import {mongoDriver} from 'simple-odm';
import {settings} from './_data';

export const weblogjs = require("../../src/app");

const config = require("../../src/config");

weblogjs.init(settings);

mongoDriver.setUp({
    database: config.getValue('dbName')
});