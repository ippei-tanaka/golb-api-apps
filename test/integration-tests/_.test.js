import {mongoDbBaseOperator, mongoDriver} from 'simple-odm';
import {settings} from './_config';
import {server} from '../../src';

describe('Integration Tests', function ()
{
    this.timeout(10000);

    mongoDriver.setUp({
        database: settings.dbName
    });

    before('dropping database', mongoDbBaseOperator.dropDatabase);
    before('web server stopping', () => server.stop(settings));
    before('web server starting', () => server.start(settings));
    beforeEach('emptying collections', mongoDbBaseOperator.removeAllDocuments);
    beforeEach('creating an admin', () => server.createAdmin(settings));
    after('web server stopping', () => server.stop(settings));

    require('./resource-home')();
    require('./resource-authentication')();
    require('./resource-users')();
    require('./resource-categories')();
    require('./resource-posts')();
    require('./resource-setting')();
});
