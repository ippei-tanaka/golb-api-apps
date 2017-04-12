import {expect} from 'chai';
import HttpClient from '../http-client';
import {testCategory, admin, settings} from './_config';

export default () =>
{
    describe('Category Resource', () =>
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

        beforeEach('login', () => adminClient.post("/login", admin));
        afterEach('logout', () => adminClient.get("/logout"));

        it('should create a new category', async () =>
        {
                const {_id} = await adminClient.post(`/categories`, testCategory);
                const category = await adminClient.get(`/categories/${_id}`);
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
                await adminClient.post(`/categories`, cat1);
                await adminClient.post(`/categories`, cat2);
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
                await adminClient.post(`/categories`, {
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
                await adminClient.post(`/categories`, {
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
            const {_id} = await adminClient.post(`/categories`, testCategory);
            const data1 = await adminClient.get(`/categories/${_id}`);
            await adminClient.put(`/categories/${_id}`, {
                name: "Hello World"
            });
            const data2 = await adminClient.get(`/categories/${_id}`);

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
                await adminClient.post(`/categories`, cat1);
                const id2 = (await adminClient.post(`/categories`, cat2))._id;
                await adminClient.put(`/categories/${id2}`, {slug: "foo"});
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
                await adminClient.post(`/categories`, cat);
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

            await adminClient.post(`/categories`, cat1);
            await adminClient.post(`/categories`, cat2);
            const data1 = await adminClient.get(`/categories`);
            await adminClient.del(`/categories/${data1.items[0]._id}`);
            const data2 = await adminClient.get(`/categories`);

            expect(data1.items).to.have.length(2);
            expect(data2.items).to.have.length(1);
        });

        it('should return a list of categories', async () =>
        {
            const cat1 = {name: "Foo", slug: "foo"};
            const cat2 = {name: "Bar", slug: "bar"};
            const cat3 = {name: "Foo Bar", slug: "foobar"};

            await adminClient.post(`/categories`, cat1);
            await adminClient.post(`/categories`, cat2);
            await adminClient.post(`/categories`, cat3);
            const data = await adminClient.get(`/categories`);
            expect(data.items).to.have.length(3);
        });

        it('should return a category', async () =>
        {
            const createdCategory = await adminClient.post(`/categories`, testCategory);
            const retreivedCategory = await adminClient.get(`/categories/${createdCategory._id}`);
            expect(retreivedCategory._id).to.equal(createdCategory._id);
            expect(retreivedCategory.name).to.equal(testCategory.name);
            expect(retreivedCategory.slug).to.equal(testCategory.slug);
        });
    });
};
