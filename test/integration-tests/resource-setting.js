import {expect} from 'chai';
import HttpClient from '../http-client';
import {admin, settings} from './_config';

export default () =>
{
    describe('Setting Resource', () =>
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

        beforeEach('login', () => client.post("/login", admin));
        afterEach('logout', () => client.get("/logout"));

        it('should set a number of posts per a page to the setting', async () =>
        {
            await client.put(`/setting`, {
                posts_per_page: 15
            });
            const setting = await client.get(`/setting`);
            expect(setting.posts_per_page).to.equal(15);
        });

        it('should return the setting with the default value', async () =>
        {
            const setting = await client.get(`/setting`);
            expect(setting.posts_per_page).to.equal(1);
        });
    });
};
