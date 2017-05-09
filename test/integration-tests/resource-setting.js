import {expect} from 'chai';
import HttpClient from '../http-client';
import config from './_config';
import {admin} from './_data';

export default () =>
{
    describe('Setting Resource', () =>
    {
        let client;

        beforeEach(() =>
        {
            client = new HttpClient({
                port: config.webPort,
                hostname: config.webHost,
                pathbase: config.adminApiRoot
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
