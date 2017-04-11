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
    beforeEach('emptying collections', suppressLog(mongoDbBaseOperator.removeAllDocuments));
    beforeEach('web server stopping', suppressLog(runner.stop));
    beforeEach('web server starting', suppressLog(runner.start));

    describe('Admin API', () =>
    {
        require('./admin-home')();
        require('./admin-login')();
        require('./admin-users')();
        require('./admin-categories')();
        require('./admin-posts')();
        require('./admin-setting')();
    });
});
