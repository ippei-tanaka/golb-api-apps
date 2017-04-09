import co from 'co';
import {expect} from 'chai';
import httpRequest from '../http-request';
import {login, logout, ADMIN_URL} from './_setup';

export default function ()
{
    describe('/setting', () =>
    {
        beforeEach('login', () => login());
        afterEach('logout', () => logout());

        it('should set a number of posts per a page to the setting', (done) =>
        {
            co(function* ()
            {
                yield httpRequest.put(`${ADMIN_URL}/setting`, {
                    posts_per_page: 15
                });
                const setting = yield httpRequest.get(`${ADMIN_URL}/setting`);
                expect(setting.posts_per_page).to.equal(15);
                done();
            }).catch((e) =>
            {
                done(e);
            });
        });

        it('should return the setting with the default value', (done) =>
        {
            co(function* ()
            {
                const setting = yield httpRequest.get(`${ADMIN_URL}/setting`);
                expect(setting.posts_per_page).to.equal(1);
                done();
            }).catch((e) =>
            {
                done(e);
            });
        });
    });
};
