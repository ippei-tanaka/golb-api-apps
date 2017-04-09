import co from 'co';
import {expect} from 'chai';
import httpRequest from '../http-request';
import {login, logout, ADMIN_URL} from './_setup';
import {testUser, admin} from './_data';

export default function ()
{
    describe('/users', () =>
    {
        beforeEach('login', () => login());
        afterEach('logout', () => logout());

        it('should return the login user data', (done) =>
        {
            co(function* ()
            {
                const user = yield httpRequest.get(`${ADMIN_URL}/users/me`);
                expect(user.email).to.equal(admin.email);
                expect(user.slug).to.equal(admin.slug);
                expect(user.display_name).to.equal(admin.display_name);
                expect(user).to.not.have.property('password');
                done();
            }).catch((e) =>
            {
                done(e);
            });
        });

        it('should create a new user', (done) =>
        {
            co(function* ()
            {
                const {_id} = yield httpRequest.post(`${ADMIN_URL}/users`, testUser);
                const user = yield httpRequest.get(`${ADMIN_URL}/users/${_id}`);
                expect(user._id).to.equal(_id);
                done();
            }).catch((e) =>
            {
                done(e);
            });
        });

        it('should return error messages if failing to create a new user', (done) =>
        {
            co(function* ()
            {
                let errors;
                try
                {
                    yield httpRequest.post(`${ADMIN_URL}/users`, {});
                }
                catch (e)
                {
                    errors = e;
                }
                expect(errors.body.email[0]).to.equal("The email is required.");
                expect(errors.body.password[0]).to.equal("The password is required.");
                expect(errors.body.display_name[0]).to.equal("The display name is required.");
                expect(errors.body.slug[0]).to.equal("The slug is required.");
                done();
            }).catch((e) =>
            {
                done(e);
            });
        });

        it('should not include a password in the retrieved user data', (done) =>
        {
            co(function* ()
            {
                const {_id} = yield httpRequest.post(`${ADMIN_URL}/users`, testUser);
                const user = yield httpRequest.get(`${ADMIN_URL}/users/${_id}`);
                expect(user).to.not.have.property('password');
                done();
            }).catch((e) =>
            {
                done(e);
            });
        });

        it("should update a user's display name", (done) =>
        {
            co(function* ()
            {
                const {_id} = yield httpRequest.post(`${ADMIN_URL}/users`, testUser);

                let user = yield httpRequest.get(`${ADMIN_URL}/users/${_id}`);
                expect(user.display_name).to.equal(testUser.display_name);

                yield httpRequest.put(`${ADMIN_URL}/users/${_id}`, {
                    display_name: "My new name"
                });

                user = yield httpRequest.get(`${ADMIN_URL}/users/${_id}`);
                expect(user.display_name).to.equal("My new name");

                done();
            }).catch((e) =>
            {
                done(e);
            });
        });

        it("should not update a user's password on '/users/:id/' path", (done) =>
        {
            co(function* ()
            {
                let error;
                try
                {
                    const {_id} = yield httpRequest.post(`${ADMIN_URL}/users`, testUser);
                    yield httpRequest.put(`${ADMIN_URL}/users/${_id}`, {
                        password: "NewPassword@@@",
                        password_confirmed: "NewPassword@@@",
                        old_password: testUser.password
                    });
                }
                catch (e)
                {
                    error = e;
                }
                expect(error.body.password[0]).to.equal("The password can't be updated.");
                done();
            }).catch((e) =>
            {
                done(e);
            });
        });

        it("should not update a user's password unless the confirmed password and their old password is sent", (done) =>
        {
            co(function* ()
            {
                let error;
                try
                {
                    const {_id} = yield httpRequest.post(`${ADMIN_URL}/users`, testUser);
                    yield httpRequest.put(`${ADMIN_URL}/users/${_id}/password`, {
                        password: "NewPassword@@@"
                    });
                }
                catch (e)
                {
                    error = e;
                }
                expect(error.body.old_password[0]).to.equal('The current password is required.');
                expect(error.body.password_confirmed[0]).to.equal('The confirmed password is required.');

                done();
            }).catch((e) =>
            {
                done(e);
            });
        });

        it("should not update a user's password if the new password isn't sent", (done) =>
        {
            co(function* ()
            {
                let error;
                try
                {
                    const {_id} = yield httpRequest.post(`${ADMIN_URL}/users`, testUser);
                    yield httpRequest.put(`${ADMIN_URL}/users/${_id}/password`, {
                        password: "",
                        password_confirmed: "NewPassword@@@",
                        old_password: testUser.password
                    });
                }
                catch (e)
                {
                    error = e;
                }
                expect(error.body.password[0]).to.equal('The new password is required.');
                done();
            }).catch((e) =>
            {
                done(e);
            });
        });

        it("should update a user's password if the confirmed password and their old password is sent", (done) =>
        {
            co(function* ()
            {
                const {_id} = yield httpRequest.post(`${ADMIN_URL}/users`, testUser);

                yield httpRequest.put(`${ADMIN_URL}/users/${_id}/password`, {
                    password: "NewPassword@@@",
                    password_confirmed: "NewPassword@@@",
                    old_password: testUser.password
                });

                done();
            }).catch((e) =>
            {
                done(e);
            });
        });

        it("should return proper error messages when the new password got a validation error", (done) =>
        {
            co(function* ()
            {
                const {_id} = yield httpRequest.post(`${ADMIN_URL}/users`, testUser);
                let error;

                try
                {
                    yield httpRequest.put(`${ADMIN_URL}/users/${_id}/password`, {
                        password: "p ss wo r d",
                        password_confirmed: "",
                        old_password: "Wrong Pass"
                    });
                }
                catch (e)
                {
                    error = e;
                }

                expect(error.body.password[0]).to
                                              .equal('Only alphabets, numbers and some symbols (#, !, @, %, &, *) are allowed for a password.');
                expect(error.body.password_confirmed[0]).to.equal('The confirmed password is required.');
                expect(error.body.old_password[0]).to.equal('The current password sent is not correct.');

                done();
            }).catch((e) =>
            {
                done(e);
            });
        });

        it("should not update a user's password if their old password is wrong", (done) =>
        {
            co(function* ()
            {
                let error;
                try
                {
                    const {_id} = yield httpRequest.post(`${ADMIN_URL}/users`, testUser);

                    yield httpRequest.put(`${ADMIN_URL}/users/${_id}/password`, {
                        password: "NewPassword@@@",
                        password_confirmed: "NewPassword@@@",
                        old_password: "WrongPassword"
                    });
                }
                catch (e)
                {
                    error = e;
                }
                expect(error.body.old_password[0]).to.equal('The current password sent is not correct.');
                done();
            }).catch((e) =>
            {
                done(e);
            });
        });

        it("should not update a user's password if the confirmed password is wrong", (done) =>
        {
            co(function* ()
            {
                let error;
                try
                {
                    const {_id} = yield httpRequest.post(`${ADMIN_URL}/users`, testUser);

                    yield httpRequest.put(`${ADMIN_URL}/users/${_id}/password`, {
                        password: "NewPassword@@@",
                        password_confirmed: "qwerqwer",
                        old_password: testUser.password
                    });
                }
                catch (e)
                {
                    error = e;
                }
                expect(error.body.password_confirmed[0]).to
                                                        .equal('The confirmed password sent is not the same as the new password.');
                done();
            }).catch((e) =>
            {
                done(e);
            });
        });
    });
};
