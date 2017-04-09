import {expect} from 'chai';
import HttpClient from '../http-client';
import {testCategory, admin} from './_data';

export default () =>
{
    describe('/categories', () =>
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

        beforeEach('login', () => client.post("/login", admin));
        afterEach('logout', () => client.get("/logout"));

        it('should create a new category', async () =>
        {
                const {_id} = await client.post(`/categories`, testCategory);
                const category = await client.get(`/categories/${_id}`);
                expect(category._id).to.be.string;
                expect(category.name).to.equal(testCategory.name);
                expect(category.slug).to.equal(testCategory.slug);
        });

        it('should not create a new category when the slug is duplicated', async () =>
        {
            const cat1 = {name: 'Category Name', slug: 'my0slug1'};
            const cat2 = {name: 'Rondom Name', slug: 'my0slug1'};

            try
            {
                await client.post(`/categories`, cat1);
                await client.post(`/categories`, cat2);
            } catch (e) {
                return;
            }

            throw new Error();
        });

        it('should not create a new category if the posted object has an empty value for a required field.', async () =>
        {
            let error;

            try
            {
                await client.post(`/categories`, {
                    name: '',
                    slug: ''
                });
            }
            catch (e)
            {
                error = e;
            }

            expect(error.body.name[0]).to.equal('The name is required.');
        });

        it('should not create a new category if the posted object has an invalid value.', async () =>
        {
            let error;

            try
            {
                await client.post(`/categories`, {
                    name: '123456789',
                    slug: 'd d'
                });
            }
            catch (e)
            {
                error = e;
            }

            expect(error.body.slug[0]).to.equal('Only alphabets, numbers and some symbols (-, _) are allowed for a slug.');
        });

        it('should partially update a category', async () =>
        {
            const {_id} = await client.post(`/categories`, testCategory);
            const data1 = await client.get(`/categories/${_id}`);
            await client.put(`/categories/${_id}`, {
                name: "Hello World"
            });
            const data2 = await client.get(`/categories/${_id}`);

            expect(data1.name).to.equal(testCategory.name);
            expect(data1.slug).to.equal(testCategory.slug);
            expect(data2.name).to.equal("Hello World");
            expect(data2.slug).to.equal(testCategory.slug);
        });


        it('should not update a category when the slug is duplicated.', async () =>
        {
            let error;

            try
            {
                const cat1 = {name: "Foo", slug: "foo"};
                const cat2 = {name: "Bar", slug: "bar"};
                await client.post(`/categories`, cat1);
                const id2 = (await client.post(`/categories`, cat2))._id;
                await client.put(`/categories/${id2}`, {slug: "foo"});
            }
            catch (e)
            {
                error = e;
            }

            expect(error.body.slug[0]).to.equal('The slug, "foo", has already been taken.');
        });

        it('should not update a category if the posted object is not valid.', async () =>
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
                await client.post(`/categories`, cat);
            }
            catch (e)
            {
                error = e;
            }

            expect(error.body.slug[0]).to.equal('Only alphabets, numbers and some symbols (-, _) are allowed for a slug.');
        });

        it('should delete a category', async () =>
        {
            const cat1 = {name: "Foo", slug: "foo"};
            const cat2 = {name: "Bar", slug: "bar"};

            await client.post(`/categories`, cat1);
            await client.post(`/categories`, cat2);
            const data1 = await client.get(`/categories`);
            await client.del(`/categories/${data1.items[0]._id}`);
            const data2 = await client.get(`/categories`);

            expect(data1.items).to.have.length(2);
            expect(data2.items).to.have.length(1);
        });

        it('should return a list of categories', async () =>
        {
            const cat1 = {name: "Foo", slug: "foo"};
            const cat2 = {name: "Bar", slug: "bar"};
            const cat3 = {name: "Foo Bar", slug: "foobar"};

            await client.post(`/categories`, cat1);
            await client.post(`/categories`, cat2);
            await client.post(`/categories`, cat3);
            const data = await client.get(`/categories`);
            expect(data.items).to.have.length(3);
        });

        it('should return a category', async () =>
        {
            const createdCategory = await client.post(`/categories`, testCategory);
            const retreivedCategory = await client.get(`/categories/${createdCategory._id}`);
            expect(retreivedCategory._id).to.equal(createdCategory._id);
            expect(retreivedCategory.name).to.equal(testCategory.name);
            expect(retreivedCategory.slug).to.equal(testCategory.slug);
        });
    });
};
