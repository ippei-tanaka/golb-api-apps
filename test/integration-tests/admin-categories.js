import co from 'co';
import {expect} from 'chai';
import httpRequest from '../http-request';
import {login, logout, ADMIN_URL} from './_setup';
import {testCategory} from './_data';

export default function ()
{
    describe('/categories', () =>
    {
        beforeEach('login', () => login());
        afterEach('logout', () => logout());

        it('should create a new category', (done) =>
        {
            co(function* ()
            {
                const {_id} = yield httpRequest.post(`${ADMIN_URL}/categories`, testCategory);
                const category = yield httpRequest.get(`${ADMIN_URL}/categories/${_id}`);
                expect(category._id).to.be.string;
                expect(category.name).to.equal(testCategory.name);
                expect(category.slug).to.equal(testCategory.slug);
                done();
            }).catch((e) =>
            {
                done(e);
            });
        });

        it('should not create a new category when the slug is duplicated', (done) =>
        {
            const cat1 = {name: 'Category Name', slug: 'my0slug1'};
            const cat2 = {name: 'Rondom Name', slug: 'my0slug1'};

            co(function* ()
            {
                yield httpRequest.post(`${ADMIN_URL}/categories`, cat1);
                yield httpRequest.post(`${ADMIN_URL}/categories`, cat2);
                done(new Error());
            }).catch(() =>
            {
                done();
            });
        });

        it('should not create a new category if the posted object has an empty value for a required field.', (done) =>
        {
            co(function* ()
            {
                let error;

                try
                {
                    yield httpRequest.post(`${ADMIN_URL}/categories`, {
                        name: '',
                        slug: ''
                    });
                }
                catch (e)
                {
                    error = e;
                }

                expect(error.body.name[0]).to.equal('The name is required.');

                done();
            }).catch((e) =>
            {
                done(e);
            });
        });

        it('should not create a new category if the posted object has an invalid value.', (done) =>
        {
            co(function* ()
            {
                let error;

                try
                {
                    yield httpRequest.post(`${ADMIN_URL}/categories`, {
                        name: '123456789',
                        slug: 'd d'
                    });
                }
                catch (e)
                {
                    error = e;
                }
                expect(error.body.slug[0]).to
                                          .equal('Only alphabets, numbers and some symbols (-, _) are allowed for a slug.');
                done();
            }).catch((e) =>
            {
                done(e);
            });
        });

        it('should partially update a category', (done) =>
        {
            co(function* ()
            {
                const {_id} = yield httpRequest.post(`${ADMIN_URL}/categories`, testCategory);
                const data1 = yield httpRequest.get(`${ADMIN_URL}/categories/${_id}`);
                yield httpRequest.put(`${ADMIN_URL}/categories/${_id}`, {
                    name: "Hello World"
                });
                const data2 = yield httpRequest.get(`${ADMIN_URL}/categories/${_id}`);

                expect(data1.name).to.equal(testCategory.name);
                expect(data1.slug).to.equal(testCategory.slug);
                expect(data2.name).to.equal("Hello World");
                expect(data2.slug).to.equal(testCategory.slug);
                done();
            }).catch((e) =>
            {
                done(e);
            });
        });

        it('should not update a category when the slug is duplicated.', (done) =>
        {
            co(function* ()
            {
                let error;

                try
                {
                    const cat1 = {name: "Foo", slug: "foo"};
                    const cat2 = {name: "Bar", slug: "bar"};
                    yield httpRequest.post(`${ADMIN_URL}/categories`, cat1);
                    const id2 = (yield httpRequest.post(`${ADMIN_URL}/categories`, cat2))._id;
                    yield httpRequest.put(`${ADMIN_URL}/categories/${id2}`, {slug: "foo"});
                }
                catch (e)
                {
                    error = e;
                }
                expect(error.body.slug[0]).to.equal('The slug, "foo", has already been taken.');

                done();
            }).catch((e) =>
            {
                done(e);
            });
        });

        it('should not update a category if the posted object is not valid.', (done) =>
        {
            co(function* ()
            {
                let error;
                let name = "";

                while (name.length < 250)
                {
                    name += "a"
                }

                try
                {
                    const cat = {name: name, slug: "fo o"};
                    yield httpRequest.post(`${ADMIN_URL}/categories`, cat);
                }
                catch (e)
                {
                    error = e;
                }

                expect(error.body.slug[0]).to
                                          .equal('Only alphabets, numbers and some symbols (-, _) are allowed for a slug.');

                done();
            }).catch((e) =>
            {
                done(e);
            });
        });

        it('should delete a category', (done) =>
        {
            const cat1 = {name: "Foo", slug: "foo"};
            const cat2 = {name: "Bar", slug: "bar"};

            co(function* ()
            {
                yield httpRequest.post(`${ADMIN_URL}/categories`, cat1);
                yield httpRequest.post(`${ADMIN_URL}/categories`, cat2);
                const data1 = yield httpRequest.get(`${ADMIN_URL}/categories`);
                yield httpRequest.del(`${ADMIN_URL}/categories/${data1.items[0]._id}`);
                const data2 = yield httpRequest.get(`${ADMIN_URL}/categories`);

                expect(data1.items).to.have.length(2);
                expect(data2.items).to.have.length(1);
                done();
            }).catch((e) =>
            {
                done(e);
            });
        });

        it('should return a list of categories', (done) =>
        {
            const cat1 = {name: "Foo", slug: "foo"};
            const cat2 = {name: "Bar", slug: "bar"};
            const cat3 = {name: "Foo Bar", slug: "foobar"};

            co(function* ()
            {
                yield httpRequest.post(`${ADMIN_URL}/categories`, cat1);
                yield httpRequest.post(`${ADMIN_URL}/categories`, cat2);
                yield httpRequest.post(`${ADMIN_URL}/categories`, cat3);
                const data = yield httpRequest.get(`${ADMIN_URL}/categories`);
                expect(data.items).to.have.length(3);
                done();
            }).catch((e) =>
            {
                done(e);
            });
        });

        it('should return a category', (done) =>
        {
            co(function* ()
            {
                const createdCategory = yield httpRequest.post(`${ADMIN_URL}/categories`, testCategory);
                const retreivedCategory = yield  httpRequest.get(`${ADMIN_URL}/categories/${createdCategory._id}`);
                expect(retreivedCategory._id).to.equal(createdCategory._id);
                expect(retreivedCategory.name).to.equal(testCategory.name);
                expect(retreivedCategory.slug).to.equal(testCategory.slug);
                done();
            }).catch((e) =>
            {
                done(e);
            });
        });

    });
};
