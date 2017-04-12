import {expect} from 'chai';
import HttpClient from '../http-client';
import {settings} from './_config';
export default () =>
{
    describe('Home', () =>
    {
        let adminClient;

        beforeEach(() =>
        {
            adminClient = new HttpClient({
                port: settings.webPort,
                hostname: settings.webHost,
                pathbase: settings.adminApiRoot
            });
        });

        it('admin homepage should return an empty object', async () =>
        {
            const obj = await adminClient.get("/");
            expect(Object.keys(obj).length).to.equal(0);
        });
    });
};
