import {mongoDbBaseOperator} from 'simple-odm';
import {weblogjs} from './_setup';

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

    before('dropping database', suppressLog(mongoDbBaseOperator.dropDatabase));
    beforeEach('emptying collections', suppressLog(mongoDbBaseOperator.removeAllDocuments));
    beforeEach('web server stopping', suppressLog(weblogjs.stop));
    beforeEach('web server starting', suppressLog(weblogjs.start));

    describe('Admin API', () =>
    {
        require('./admin-home')();
        require('./admin-login')();
        //require('./admin-users')();
        //require('./admin-categories')();
        //require('./admin-posts')();
        //require('./admin-setting')();
    });
});
