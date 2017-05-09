import {expect} from 'chai';
import HttpClient from '../http-client';
import config from './_config';
import {admin, testCategory} from './_data';

export default () =>
{
    describe('Category Resource', () =>
    {
        let adminClient;
        let publicClient;

        beforeEach(() =>
        {
            adminClient = new HttpClient({
                port: config.webPort,
                hostname: config.webHost,
                pathbase: config.adminApiRoot
            });

            publicClient = new HttpClient({
                port: config.webPort,
                hostname: config.webHost,
                pathbase: config.publicApiRoot
            });
        });

        beforeEach('login', () => adminClient.post("/login", admin));
        afterEach('logout', () => adminClient.get("/logout"));

        const createOptionalData = async (prefix = "") =>
        {

            let result = await adminClient.post(`/users`, {
                email: `${prefix}test@test.com`,
                password: "testtest",
                slug: `${prefix}test-test`,
                display_name: `${prefix}Test User`
            });

            const user = await adminClient.get(`/users/${result._id}`);

            result = await adminClient.post(`/categories`, {
                name: `${prefix}Test Category`,
                slug: `${prefix}test-category`
            });

            const category = await adminClient.get(`/categories/${result._id}`);

            return {
                author_id: user._id,
                category_id: category._id,
                author_slug: user.slug,
                category_slug: category.slug
            };
        };

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
            let error;

            try
            {
                await adminClient.post(`/categories`, cat1);
                await adminClient.post(`/categories`, cat2);
            } catch (e) {
                error = e;
            }

            expect(error.body.message.slug[0]).to.equal('The slug, "my0slug1", has already been taken.');
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

            expect(error.body.message.name[0]).to.equal('The name is required.');
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

            expect(error.body.message.slug[0]).to.equal('Only alphabets, numbers and some symbols (-, _) are allowed for a slug.');
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

            expect(error.body.message.slug[0]).to.equal('The slug, "foo", has already been taken.');
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

            expect(error.body.message.slug[0]).to.equal('Only alphabets, numbers and some symbols (-, _) are allowed for a slug.');
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

        it('should return all the categories used on the blog posts and the numbers of posts', async () =>
        {
            const options1 = await createOptionalData("a");
            const options2 = await createOptionalData("b");
            const options3 = await createOptionalData("c");
            const options4 = await createOptionalData("d");
            await adminClient.put("/setting", {posts_per_page: 10});
            const yesterday = new Date(new Date().getTime() - (24 * 60 * 60 * 1000));

            await adminClient.post("/posts", {title: "Post 1", slug:"post_1", content: "Test", published_date: yesterday, ...options1});
            await adminClient.post("/posts", {title: "Post 2", slug:"post_2", content: "Test", published_date: yesterday, ...options1});
            await adminClient.post("/posts", {title: "Post 3", slug:"post_3", content: "Test", published_date: yesterday, ...options2});
            await adminClient.post("/posts", {title: "Post 4", slug:"post_4", content: "Test", ...options3});
            await adminClient.post("/posts", {title: "Post 5", slug:"post_5", content: "Test", published_date: yesterday, ...options4});

            let obj;

            obj = await publicClient.get("/categories");
            expect(obj.categories.length).to.equal(3);
            expect(obj.categories[0]._id).to.equal(options1.category_id);
            expect(obj.categories[0].size).to.equal(2);
            expect(obj.categories[1]._id).to.equal(options2.category_id);
            expect(obj.categories[1].size).to.equal(1);
            expect(obj.categories[2]._id).to.equal(options4.category_id);
            expect(obj.categories[2].size).to.equal(1);
        });
    });
};
