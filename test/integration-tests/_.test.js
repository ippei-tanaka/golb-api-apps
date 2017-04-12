import {mongoDbBaseOperator, mongoDriver} from 'simple-odm';
import {settings} from './_config';
import * as runner from './_runner';

const suppressLog = (func) => () =>
{
    const log = console.log;
    console.log = () => {};
    return func().then(() =>
    {
        console.log = log;
    });
};

describe('Integration Tests', function ()
{
    this.timeout(10000);

    mongoDriver.setUp({
        database: settings.dbName
    });

    before('dropping database', suppressLog(mongoDbBaseOperator.dropDatabase));
    before('web server stopping', suppressLog(runner.stop));
    before('web server starting', suppressLog(runner.start));
    beforeEach('emptying collections', suppressLog(mongoDbBaseOperator.removeAllDocuments));
    beforeEach('creating an admin', suppressLog(runner.createAdmin));
    after('web server stopping', suppressLog(runner.stop));

    require('./resource-home')();
    require('./resource-authentication')();
    require('./resource-users')();
    require('./resource-categories')();
    require('./resource-posts')();
    require('./resource-setting')();
});
