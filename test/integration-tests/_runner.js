import express from 'express';
import {settings} from './_config';
import {AdminApiApp, PublicApiApp} from '../../src/app';

let server;

export const start = async () =>
{
    const app = express();
    const adminApiApp = new AdminApiApp(settings);
    const publicSiteApp = new PublicApiApp(settings);

    app.use(settings.adminApiRoot, adminApiApp);
    app.use(settings.publicApiRoot, publicSiteApp);

    await adminApiApp.insertUser({
        email: settings.adminEmail,
        password: settings.adminPassword,
        display_name: settings.adminDisplayName,
        slug: settings.adminSlug
    });

    server = await app.listen(settings.webPort, settings.webHost,
        error =>
        {
            if (error) throw error;
        }
    );

    console.log("WeblogJS has started.");
    console.log(`Public API: http://${settings.webHost}:${settings.webPort}${settings.publicApiRoot}`);
    console.log(`Admin API: http://${settings.webHost}:${settings.webPort}${settings.adminApiRoot}`);
};

export const stop = async () =>
{
    if (server)
    {
        console.log("WeblogJS has stopped.");
        await server.close();
    }
};