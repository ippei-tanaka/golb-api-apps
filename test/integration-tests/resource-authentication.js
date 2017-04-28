import {expect} from 'chai';
import HttpClient from '../http-client';
import {settings, admin} from './_config';

export default () =>
{
    describe('Authentication', () =>
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

        it('should give a 401 error if the user try to retrieve restricted data when they haven\'t logged in', async () =>
        {
            let response;

            try
            {
                await adminClient.get("/users");
            }
            catch (r)
            {
                response = r;
            }

            expect(response.statusCode).to.equal(401);
        });

        it('should let the user log in and log out', async () =>
        {
            await adminClient.post("/login", admin);
            await adminClient.get("/users");
            await adminClient.get("/logout");
        });

        it('should return an error if the email doesn\'t exist in the DB.', async () =>
        {
            let error;

            try
            {
                await adminClient.post("/login", {...admin, email: "td@dsad.cc"});
            }
            catch (e)
            {
                error = e;
            }

            expect(error.body.message.email[0]).to.equal('The email , "td@dsad.cc", is not registered.');
        });

        it('should return an error if the password is wrong.', async () =>
        {
            let error;

            try
            {
                await adminClient.post("/login", {...admin, password: "1234123dsaf32"});
            }
            catch (e)
            {
                error = e;
            }

            expect(error.body.message.password[0]).to.equal('The submitted password is wrong.');
        });
    });
};
