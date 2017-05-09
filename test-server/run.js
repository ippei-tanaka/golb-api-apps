import * as server from './server';
import config from './config';
import {URL} from 'url';

const url = new URL(`http://${config.webHost}:${config.webPort}`);

(async () =>
{
    await server.start(config);
    await server.createAdmin(config);

    console.log("The web server has stated.\n");

    url.pathname = config.adminApiRoot;
    console.log(`${url.toString()} (Admin API)\n`);

    url.pathname = config.publicApiRoot;
    console.log(`${url.toString()} (Public API)`);
})().catch((e = {}) => console.error(e.message || e));
