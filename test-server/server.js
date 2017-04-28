import express from 'express';
import {AdminApiApp, PublicApiApp} from '../src';
import cors from 'cors';

let server;
let app;
let adminApiApp;
let publicSiteApp;

export const start = async (config) =>
{
    if (!app)
    {
        app = express();
        app.use(cors());
    }

    if (!adminApiApp)
    {
        adminApiApp = new AdminApiApp(config);
        app.use(config.adminApiRoot, adminApiApp);
    }

    if (!publicSiteApp)
    {
        publicSiteApp = new PublicApiApp(config);
        app.use(config.publicApiRoot, publicSiteApp);
    }

    server = await app.listen(config.webPort, config.webHost,
        error =>
        {
            if (error) throw error;
        }
    );
};

export const createAdmin = async (config = {}) =>
{
    if (adminApiApp)
    {
        await adminApiApp.insertUser({
            email: config.adminEmail,
            password: config.adminPassword,
            display_name: config.adminDisplayName,
            slug: config.adminSlug
        });
    }
};

export const stop = async (config) =>
{
    if (server)
    {
        await server.close();
    }
};