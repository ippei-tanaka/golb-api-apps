const initialConfig = Object.freeze({
    dbHost: "localhost",
    dbPort: 27017,
    dbName: "weblogjs",

    webProtocol: "http",
    webHost: "localhost",
    webPort: 8080,

    adminSiteStaticPaths: [],

    publicSiteStaticPaths: [],

    sessionSecret: "sdnIdjSe2AE2SADfD",

    adminEmail: "t@t.com",
    adminPassword: "tttttttt",
    adminDisplayName: "Admin",
    adminSlug: 'admin'
});

const config = Object.assign({}, initialConfig);

Object.defineProperty(config, 'adminApiRoot', {
    get: () => "/admin-api"
});

/*
Object.defineProperty(config, 'adminSiteRoot', {
    get: () => "/admin"
});
*/

Object.defineProperty(config, 'publicApiRoot', {
    get: () => "/public-api"
});

/*
Object.defineProperty(config, 'publicSiteRoot', {
    get: () => "/"
});
*/

export default Object.freeze({

    setValues: (values) =>
    {
        for (const key of Object.keys(values))
        {
            if (config[key] !== undefined)
            {
                config[key] = values[key];
            }
        }
    },

    getValues: () =>
    {
        const obj = {};

        for (const key of Object.getOwnPropertyNames(config))
        {
            obj[key] = config[key];
        }

        return obj;
    },

    getValue: (key) =>
    {
        return config[key];
    }
});