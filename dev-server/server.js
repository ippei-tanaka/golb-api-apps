import express from 'express';
import {AdminApiApp, PublicApiApp} from '../src';
import cors from 'cors';
import path from 'path';
import {URL} from 'url';

let server;
let app;
let adminApiApp;
let publicSiteApp;

const corsOptions =
{
    origin: (origin, callback) =>
    {
        let url;

        try {
            url = new URL(origin);
        } catch (e) {
            throw e;
        }

        if (url.hostname === "localhost" || url.hostname === "127.0.0.1")
        {
            callback(null, true);
        } else {
            throw new Error(`${url} isn't allowed by CORS.`);
        }
    },

    credentials: true
};

export const start = async (config) =>
{
    if (!app)
    {
        app = express();

        if (config.cors)
        {
            app.use(cors(corsOptions));
            app.options('*', cors());
        }

        app.use(express.static(path.resolve(__dirname, "static")));
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

export const stop = async () =>
{
    if (server)
    {
        await server.close();
    }
};