import {admin} from './_data';

export default {
    webHost: "localhost",
    webPort: 3002,
    dbName: "golb-rest-api-test",
    adminEmail: admin.email,
    adminPassword: admin.password,
    adminDisplayName: admin.display_name,
    adminSlug: admin.slug,
    sessionSecret: "sdnIdjSe2AE2SADfD",
    adminApiRoot: "/admin-api",
    publicApiRoot: "/public-api",
    cors: false
};