import {expect} from 'chai';
import HttpClient from '../http-client';
import {settings} from './_config';
export default () =>
{
    describe('/home', () =>
    {
        let client;

        beforeEach(() =>
        {
            client = new HttpClient({
                port: settings.webPort,
                hostname: settings.webHost,
                pathbase: settings.adminApiRoot
            });
        });

        it('should return an empty object', async () =>
        {
            const obj = await client.get("/");
            expect(Object.keys(obj).length).to.equal(0);
        });
    });
};
