import {mongoDbBaseOperator, mongoDriver} from 'simple-odm';
import {settings} from './_config';
import * as runner from './_runner';

describe('Integration Tests', function ()
{
    this.timeout(10000);

    mongoDriver.setUp({
        database: settings.dbName
    });

    before('dropping database', mongoDbBaseOperator.dropDatabase);
    before('web server stopping', runner.stop);
    before('web server starting', runner.start);
    beforeEach('emptying collections', mongoDbBaseOperator.removeAllDocuments);
    beforeEach('creating an admin', runner.createAdmin);
    after('web server stopping', runner.stop);

    require('./resource-home')();
    require('./resource-authentication')();
    require('./resource-users')();
    require('./resource-categories')();
    require('./resource-posts')();
    require('./resource-setting')();
});
