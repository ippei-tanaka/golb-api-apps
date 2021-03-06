import {expect} from 'chai';
import HttpClient from '../http-client';
import config from './_config';
import {admin, testUser} from './_data';

export default () =>
{
    describe('User Resource', () =>
    {
        let adminClient;

        beforeEach(() =>
        {
            adminClient = new HttpClient({
                port: config.webPort,
                hostname: config.webHost,
                pathbase: config.adminApiRoot
            });
        });

        beforeEach('login', () => adminClient.post("/login", admin));
        afterEach('logout', () => adminClient.get("/logout"));

        it('should return the login user data', async () =>
        {
            const user = await adminClient.get("/users/me");
            expect(user.email).to.equal(admin.email);
            expect(user.slug).to.equal(admin.slug);
            expect(user.display_name).to.equal(admin.display_name);
            expect(user).to.not.have.property('password');
            expect(user).to.not.have.property('hashed_password');
        });

        it('should create a new user', async () =>
        {
            const {_id} = await adminClient.post("/users", testUser);
            const user = await adminClient.get(`/users/${_id}`);
            expect(user._id).to.equal(_id);
        });

        it('should return error messages if failing to create a new user', async () =>
        {
            let errors;

            try
            {
                await adminClient.post("/users", {});
            }
            catch (e)
            {
                errors = e;
            }

            expect(errors.body.message.email[0]).to.equal("The email is required.");
            expect(errors.body.message.password[0]).to.equal("The password is required.");
            expect(errors.body.message.display_name[0]).to.equal("The display name is required.");
            expect(errors.body.message.slug[0]).to.equal("The slug is required.");
        });

        it('should not create a new user if their email is duplicated', async () =>
        {
            let error;

            try {
                await adminClient.post("/users", testUser);
                await adminClient.post("/users", {...testUser, slug: testUser.slug + "123"});
            } catch (e)
            {
                error = e;
            }

            expect(error.body.message.email[0]).to.equal(`The email, "${testUser.email}", has already been taken.`);
        });

        it('should not create a new user if their slug is duplicated', async () =>
        {
            let error;

            try {
                await adminClient.post("/users", testUser);
                await adminClient.post("/users", {...testUser, email: testUser.email + "ee"});
            } catch (e)
            {
                error = e;
            }

            expect(error.body.message.slug[0]).to.equal(`The slug, "${testUser.slug}", has already been taken.`);
        });

        it('should not include a password in the retrieved user data', async () =>
        {
            const {_id} = await adminClient.post("/users", testUser);
            const user = await adminClient.get(`/users/${_id}`);
            expect(user).to.not.have.property('password');
        });

        it('should send an error if the email is not valid', async () =>
        {
            let error;

            try
            {
                await adminClient.post("/users", {...testUser, email: "or@ote.pe3"});
            }
            catch (e)
            {
                error = e;
            }

            expect(error.body.message.email[0]).to.equal("A email should be a valid email.");
        });

        it("should update a user's display name", async () =>
        {
            const {_id} = await adminClient.post("/users", testUser);

            let user = await adminClient.get(`/users/${_id}`);
            expect(user.display_name).to.equal(testUser.display_name);

            await adminClient.put(`/users/${_id}`, {
                display_name: "My new name"
            });

            user = await adminClient.get(`/users/${_id}`);
            expect(user.display_name).to.equal("My new name");
        });

        it("should not update a user's email if the new email is duplicated.", async () =>
        {
            let error;

            try
            {
                await adminClient.post("/users", testUser);
                const {_id} = await adminClient.post("/users", {...testUser, email: testUser.email + "dd", slug: testUser.slug + "rr"});
                await adminClient.put(`/users/${_id}`, {
                    email: testUser.email
                });
            }
            catch (e)
            {
                error = e;
            }

            expect(error.body.message.email[0]).to.equal(`The email, "${testUser.email}", has already been taken.`);
        });

        it("should not update a user's password on '/users/:id/' path", async () =>
        {
            let error;

            try
            {
                const {_id} = await adminClient.post("/users", testUser);
                await adminClient.put(`/users/${_id}`, {
                    password: "NewPassword@@@",
                    password_confirmed: "NewPassword@@@",
                    old_password: testUser.password
                });
            }
            catch (e)
            {
                error = e;
            }

            expect(error.body.message.password[0]).to.equal("The password can't be updated.");
        });

        it("should not update a user's password unless the confirmed password and their old password is sent", async () =>
        {
            let error;

            try
            {
                const {_id} = await adminClient.post("/users", testUser);
                await adminClient.put(`/users/${_id}/password`, {
                    password: "NewPassword@@@"
                });
            }
            catch (e)
            {
                error = e;
            }

            expect(error.body.message.old_password[0]).to.equal('The current password is required.');
            expect(error.body.message.password_confirmed[0]).to.equal('The confirmed password is required.');
        });

        it("should not update a user's password if the new password isn't sent", async () =>
        {
            let error;

            try
            {
                const {_id} = await adminClient.post("/users", testUser);
                await adminClient.put(`/users/${_id}/password`, {
                    password: "",
                    password_confirmed: "NewPassword@@@",
                    old_password: testUser.password
                });
            }
            catch (e)
            {
                error = e;
            }

            expect(error.body.message.password[0]).to.equal('The new password is required.');
        });

        it("should update a user's password if the confirmed password and their old password is sent", async () =>
        {
            const {_id} = await adminClient.post(`/users`, testUser);

            await adminClient.put(`/users/${_id}/password`, {
                password: "NewPassword@@@",
                password_confirmed: "NewPassword@@@",
                old_password: testUser.password
            });
        });

        it("should return proper error messages when the new password got a validation error", async () =>
        {
            const {_id} = await adminClient.post("/users", testUser);

            let error;

            try
            {
                await adminClient.put(`/users/${_id}/password`, {
                    password: "p ss wo r d",
                    password_confirmed: "",
                    old_password: "Wrong Pass"
                });
            }
            catch (e)
            {
                error = e;
            }

            expect(error.body.message.password[0]).to
                                          .equal('Only alphabets, numbers and some symbols (#, !, @, %, &, *) are allowed for a password.');
            expect(error.body.message.password_confirmed[0]).to.equal('The confirmed password is required.');
            expect(error.body.message.old_password[0]).to.equal('The current password sent is not correct.');
        });

        it("should not update a user's password if their old password is wrong", async () =>
        {
            let error;

            try
            {
                const {_id} = await adminClient.post("/users", testUser);

                await adminClient.put(`/users/${_id}/password`, {
                    password: "NewPassword@@@",
                    password_confirmed: "NewPassword@@@",
                    old_password: "WrongPassword"
                });
            }
            catch (e)
            {
                error = e;
            }

            expect(error.body.message.old_password[0]).to.equal('The current password sent is not correct.');
        });

        it("should not update a user's password if the confirmed password is wrong", async () =>
        {
            let error;

            try
            {
                const {_id} = await adminClient.post("/users", testUser);

                await adminClient.put(`/users/${_id}/password`, {
                    password: "NewPassword@@@",
                    password_confirmed: "qwerqwer",
                    old_password: testUser.password
                });
            }
            catch (e)
            {
                error = e;
            }

            expect(error.body.message.password_confirmed[0]).to
                                                    .equal('The confirmed password sent is not the same as the new password.');
        });

        it("should not allow a user to delete themselves", async () =>
        {
            let error;

            try
            {

                const test = await adminClient.post("/users", testUser);
                await adminClient.del(`/users/${test._id}`);

                const me = await adminClient.get("users/me");
                await adminClient.del(`/users/${me._id}`);
            }
            catch (e)
            {
                error = e;
            }

            expect(error.body.message[0]).to.equal("Deleting your own account is forbidden.");
        });

    });
};
