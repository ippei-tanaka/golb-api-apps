import express from 'express';

let server;

export const init = (values) =>
{
    const config = require('./config');
    config.setValues(values);
};

export const start = async () =>
{
    const config = require('./config');
    const adminApiApp = require('./admin-app');
    const publicSiteApp = require('./public-app');
    const UserModel = require('./models/user-model');
    const app = express();

    app.use(config.getValue('adminApiRoot'), adminApiApp);
    app.use(config.getValue('publicApiRoot'), publicSiteApp);

    // Create an admin user if it doesn't exist.

    const admin = await UserModel.findOne({
        email: config.getValue('adminEmail')
    });

    try
    {
        if (!admin)
        {
            await new UserModel({
                email: config.getValue('adminEmail'),
                password: config.getValue('adminPassword'),
                display_name: config.getValue('adminDisplayName'),
                slug: config.getValue('adminSlug')
            }).save();
        }
    }
    catch (e)
    {
        console.error(e.message);
        console.error('WeblogJS failed to start up.');
        return;
    }

    // Start a web server

    const promise = new Promise((resolve, reject) =>
    {
        server = app.listen(
            config.getValue('webPort'),
            config.getValue('webHost'),
            (e) =>
            {
                if (e) return reject(e);
                resolve();
            }
        );
    });

    console.log("WeblogJS has started.");
    console.log(`Public API: http://${config.getValue('webHost')}:${config.getValue('webPort')}${config.getValue('publicApiRoot')}`);
    console.log(`Admin API: http://${config.getValue('webHost')}:${config.getValue('webPort')}${config.getValue('adminApiRoot')}`);

    return await promise;

};

export const stop = async () =>
{
    if (server)
    {
        console.log("WeblogJS has stopped.");
        await server.close();
    }
};