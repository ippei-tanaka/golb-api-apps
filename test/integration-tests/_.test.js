import {mongoDbBaseOperator, mongoDriver} from 'simple-odm';
import {settings} from './_config';
import * as runner from '../../src/runner';

describe('Integration Tests', function ()
{
    this.timeout(10000);

    mongoDriver.setUp({
        database: settings.dbName
    });

    before('dropping database', mongoDbBaseOperator.dropDatabase);
    before('web server stopping', runner.stop.bind(null, settings));
    before('web server starting', runner.start.bind(null, settings));
    beforeEach('emptying collections', mongoDbBaseOperator.removeAllDocuments);
    beforeEach('creating an admin', runner.createAdmin.bind(null, settings));
    after('web server stopping', runner.stop.bind(null, settings));

    require('./resource-home')();
    require('./resource-authentication')();
    require('./resource-users')();
    require('./resource-categories')();
    require('./resource-posts')();
    require('./resource-setting')();
});
