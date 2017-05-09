import {mongoDbBaseOperator, mongoDriver} from 'simple-odm';
import config from './_config';
import * as server from '../../dev-server/server';

describe('Integration Tests', function ()
{
    this.timeout(10000);

    mongoDriver.setUp({
        database: config.dbName
    });

    before('dropping database', mongoDbBaseOperator.dropDatabase);
    before('web server stopping', () => server.stop(config));
    before('web server starting', () => server.start(config));
    beforeEach('emptying collections', mongoDbBaseOperator.removeAllDocuments);
    beforeEach('creating an admin', () => server.createAdmin(config));
    after('web server stopping', () => server.stop(config));

    require('./resource-home')();
    require('./resource-authentication')();
    require('./resource-users')();
    require('./resource-categories')();
    require('./resource-posts')();
    require('./resource-setting')();
});
