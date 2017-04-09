import {expect} from 'chai';
import HttpClient from '../http-client';

export default () =>
{
    describe('/home', () =>
    {
        const config = require("../../src/config");

        let client;

        beforeEach(() =>
        {
            client = new HttpClient({
                port: config.getValue('webPort'),
                hostname: config.getValue('webHost'),
                pathbase: config.getValue('adminApiRoot')
            });
        });

        it('should return an empty object', async () =>
        {
            const obj = await client.get("/");
            expect(Object.keys(obj).length).to.equal(0);
        });
    });
};
