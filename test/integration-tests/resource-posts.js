import {expect} from 'chai';
import HttpClient from '../http-client';
import {testPost, admin, settings} from './_config';

export default () =>
{
    describe('Post Resource', () =>
    {
        let adminClient;
        let publicClient;

        beforeEach(() =>
        {
            adminClient = new HttpClient({
                port: settings.webPort,
                hostname: settings.webHost,
                pathbase: settings.adminApiRoot
            });

            publicClient = new HttpClient({
                port: settings.webPort,
                hostname: settings.webHost,
                pathbase: settings.publicApiRoot
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
                category_id: category._id
            };
        };

        it('should create a new post', async () =>
        {
            const options = await createOptionalData();
            const {_id} = await adminClient.post(`/posts`, {...testPost, ...options});
            await adminClient.get(`/posts/${_id}`);
        });

        it('should return a post', async () =>
        {
            const options = await createOptionalData();
            const {_id} = await adminClient.post(`/posts`, {...testPost, ...options});
            const post = await adminClient.get(`/posts/${_id}`);

            expect(post._id).to.equal(_id);
            expect(post.title).to.equal(testPost.title);
            expect(post.slug).to.equal(testPost.slug);
            expect(post.tags).to.include(testPost.tags[0]);
            expect(post.tags).to.include(testPost.tags[1]);
            expect(post.tags).to.include(testPost.tags[2]);
        });

        it('should return type error messages', async () =>
        {
            let error;

            try
            {
                await adminClient.post(`/posts`, {
                    title: "Hello World",
                    slug: "hello-world",
                    content: "test",
                    author_id: "ddddd"
                });
            }
            catch (e)
            {
                error = e;
            }

            expect(error.body.author_id[0]).to.equal('The author ID, "ddddd", is invalid.');
        });

        it('should return a list of posts', async () =>
        {
            const options = await createOptionalData();
            await adminClient.post(`/posts`, {...testPost, ...options, slug: '1'});
            await adminClient.post(`/posts`, {...testPost, ...options, slug: '2'});
            await adminClient.post(`/posts`, {...testPost, ...options, slug: '3'});
            await adminClient.post(`/posts`, {...testPost, ...options, slug: '4'});
            await adminClient.post(`/posts`, {...testPost, ...options, slug: '5'});
            const json = await adminClient.get(`/posts/`);
            const posts = json.items;

            expect(posts.length).to.equal(5);
            let count = 1;

            for (let post of posts)
            {
                expect(post._id).to.be.string;
                expect(post.title).to.equal(testPost.title);
                expect(post.slug).to.equal(String(count));
                expect(post.author_id).to.equal(options.author_id);
                expect(post.category_id).to.equal(options.category_id);
                count += 1;
            }
        });

        it('should return a filtered and sorted list of posts', async () =>
        {
            const options1 = await createOptionalData("a");
            const options2 = await createOptionalData("b");

            await adminClient.post(`/posts`, {
                title: "Intro to Javascript",
                slug: "intro-to-js",
                content: "Not Yet",
                ...options1
            });

            await adminClient.post(`/posts`, {
                title: "Questions about Life",
                slug: "questions",
                content: "I don't know!",
                ...options2
            });

            await adminClient.post(`/posts`, {
                title: "Favourite Food",
                slug: "favourite-food",
                content: "I like miso soup and beef stew.",
                ...options2
            });

            await adminClient.post(`/posts`, {
                title: "Abstract Food",
                slug: "abstract-food",
                content: "Diet Food",
                ...options2
            });

            let json = await adminClient.get(`/posts/?query={"slug":"questions"}`);
            let posts = json.items;

            expect(posts.length).to.equal(1);
            expect(posts[0].title).to.equal("Questions about Life");

            json = await adminClient.get(`/posts/?skip=1&limit=2&sort={"slug":1}`);
            posts = json.items;

            expect(posts.length).to.equal(2);
            expect(posts[0].title).to.equal("Favourite Food");
            expect(posts[1].title).to.equal("Intro to Javascript");
        });

        it('should return public posts properly', async () => {

            const options = await createOptionalData();
            const yesterday = new Date(new Date().getTime() - (24 * 60 * 60 * 1000));
            const tomorrow = new Date(new Date().getTime() + (24 * 60 * 60 * 1000));

            await adminClient.put(`/setting`, {posts_per_page: 10});

            /* no  */ await adminClient.post(`/posts`, {title: "Post 1", slug:"post_1", content: "Test", ...options});
            /* yes */ await adminClient.post(`/posts`, {title: "Post 2", slug:"post_2", content: "Test", published_date: yesterday, ...options});
            /* no  */ await adminClient.post(`/posts`, {title: "Post 3", slug:"post_3", content: "Test", published_date: tomorrow, ...options});
            /* yes */ await adminClient.post(`/posts`, {title: "Post 4", slug:"post_4", content: "Test", is_draft: false, published_date: yesterday, ...options});
            /* no  */ await adminClient.post(`/posts`, {title: "Post 5", slug:"post_5", content: "Test", is_draft: true, published_date: yesterday, ...options});
            /* yes */ await adminClient.post(`/posts`, {title: "Post 6", slug:"post_6", content: "Test", published_date: yesterday, ...options});

            let obj = await publicClient.get(`/posts`);
            expect(obj.posts.length).to.equal(3);
            expect(obj.posts[0].title).to.equal("Post 2");
            expect(obj.posts[1].title).to.equal("Post 4");
            expect(obj.posts[2].title).to.equal("Post 6");

            obj = await publicClient.get(`/posts/page/1`);
            expect(obj.posts.length).to.equal(3);
            expect(obj.posts[0].title).to.equal("Post 2");
            expect(obj.posts[1].title).to.equal("Post 4");
            expect(obj.posts[2].title).to.equal("Post 6");

            obj = await publicClient.get(`/posts/page/2`);
            expect(obj.posts.length).to.equal(0);

            obj = await publicClient.get(`/posts`);
            expect(obj.posts.length).to.equal(3);
            expect(obj.posts[0].title).to.equal("Post 2");
            expect(obj.posts[1].title).to.equal("Post 4");
            expect(obj.posts[2].title).to.equal("Post 6");

            obj = await publicClient.get(`/posts/page/1`);
            expect(obj.posts.length).to.equal(3);
            expect(obj.posts[0].title).to.equal("Post 2");
            expect(obj.posts[1].title).to.equal("Post 4");
            expect(obj.posts[2].title).to.equal("Post 6");

            obj = await publicClient.get(`/posts/page/2`);
            expect(obj.posts.length).to.equal(0);

            await adminClient.put(`/setting`, {posts_per_page: 2});
            obj = await publicClient.get(`/posts`);
            expect(obj.posts.length).to.equal(2);
            expect(obj.posts[0].title).to.equal("Post 2");
            expect(obj.posts[1].title).to.equal("Post 4");

            obj = await publicClient.get(`/posts/page/2`);
            expect(obj.posts.length).to.equal(1);
            expect(obj.posts[0].title).to.equal("Post 6");
        });
    });
};
