import express from 'express';
import defaultConfig from './default-config';
import {AdminApiApp, PublicApiApp} from './index';

let server;
let app;
let adminApiApp;
let publicSiteApp;

export const start = async (config) =>
{
    const _config = {...defaultConfig, ...config};

    if (!app)
    {
        app = express();
    }

    if (!adminApiApp)
    {
        adminApiApp = new AdminApiApp(_config);
        app.use(_config.adminApiRoot, adminApiApp);
    }

    if (!publicSiteApp)
    {
        publicSiteApp = new PublicApiApp(_config);
        app.use(_config.publicApiRoot, publicSiteApp);
    }

    server = await app.listen(_config.webPort, _config.webHost,
        error =>
        {
            if (error) throw error;
            if (!_config.silent) console.log("Golb Rest API has started.");
        }
    );
};

export const createAdmin = async (config = {}) =>
{
    const _config = {...defaultConfig, ...config};

    if (adminApiApp)
    {
        await adminApiApp.insertUser({
            email: _config.adminEmail,
            password: _config.adminPassword,
            display_name: _config.adminDisplayName,
            slug: _config.adminSlug
        });

        if (!_config.silent) console.log("Golb Rest API has created an admin user.");
    }
    else
    {
        if (!_config.silent) console.log("Golb Rest API has failed to create an admin user.");
    }

};

export const stop = async (config) =>
{
    const _config = {...defaultConfig, ...config};

    if (server)
    {
        await server.close();
        if (!_config.silent) console.log("Golb Rest API has stopped.");
    }
};