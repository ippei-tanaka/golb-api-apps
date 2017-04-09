import co from 'co';
import {expect} from 'chai';
import httpRequest from '../http-request';
import {login, logout, ADMIN_URL} from './_setup';
import {testPost} from './_data';

export default function ()
{
    describe('/posts', () =>
    {
        beforeEach('login', () => login());
        afterEach('logout', () => logout());

        const createOptionalData = (prefix = "") => co(function* ()
        {

            let result = yield httpRequest.post(`${ADMIN_URL}/users`, {
                email: `${prefix}test@test.com`,
                password: "testtest",
                slug: `${prefix}test-test`,
                display_name: `${prefix}Test User`
            });

            const user = yield httpRequest.get(`${ADMIN_URL}/users/${result._id}`);

            result = yield httpRequest.post(`${ADMIN_URL}/categories`, {
                name: `${prefix}Test Category`,
                slug: `${prefix}test-category`
            });

            const category = yield httpRequest.get(`${ADMIN_URL}/categories/${result._id}`);

            return {
                author_id: user._id,
                category_id: category._id
            };
        });

        it('should create a new post', (done) =>
        {
            co(function* ()
            {
                const options = yield createOptionalData();
                const {_id} = yield httpRequest.post(`${ADMIN_URL}/posts`, Object.assign({}, testPost, options));
                yield httpRequest.get(`${ADMIN_URL}/posts/${_id}`);
                done();
            }).catch((e) =>
            {
                done(e);
            });
        });

        it('should return a post', (done) =>
        {
            co(function* ()
            {
                const options = yield createOptionalData();
                const {_id} = yield httpRequest.post(`${ADMIN_URL}/posts`, Object.assign({}, testPost, options));
                const post = yield httpRequest.get(`${ADMIN_URL}/posts/${_id}`);
                expect(post._id).to.equal(_id);
                expect(post.title).to.equal(testPost.title);
                expect(post.slug).to.equal(testPost.slug);
                expect(post.tags).to.include(testPost.tags[0]);
                expect(post.tags).to.include(testPost.tags[1]);
                expect(post.tags).to.include(testPost.tags[2]);
                done();
            }).catch((e) =>
            {
                done(e);
            });
        });

        it('should return type error messages', (done) =>
        {
            co(function* ()
            {
                let error;
                try
                {
                    yield httpRequest.post(`${ADMIN_URL}/posts`, {
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
                done();
            }).catch((e) =>
            {
                done(e);
            });
        });


        it('should return a list of posts', (done) =>
        {
            co(function* ()
            {
                const options = yield createOptionalData();
                yield httpRequest.post(`${ADMIN_URL}/posts`, Object.assign({}, testPost, options, {slug: '1'}));
                yield httpRequest.post(`${ADMIN_URL}/posts`, Object.assign({}, testPost, options, {slug: '2'}));
                yield httpRequest.post(`${ADMIN_URL}/posts`, Object.assign({}, testPost, options, {slug: '3'}));
                yield httpRequest.post(`${ADMIN_URL}/posts`, Object.assign({}, testPost, options, {slug: '4'}));
                yield httpRequest.post(`${ADMIN_URL}/posts`, Object.assign({}, testPost, options, {slug: '5'}));
                const json = yield httpRequest.get(`${ADMIN_URL}/posts/`);
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

                done();
            }).catch((e) =>
            {
                done(e);
            });
        });

        it('should return a filtered and sorted list of posts', (done) =>
        {
            co(function* ()
            {
                const options1 = yield createOptionalData(1);
                const options2 = yield createOptionalData(2);

                yield httpRequest.post(`${ADMIN_URL}/posts`, Object.assign({
                    title: "Intro to Javascript",
                    slug: "intro-to-js",
                    content: "Not Yet"
                }, options1));

                yield httpRequest.post(`${ADMIN_URL}/posts`, Object.assign({
                    title: "Questions about Life",
                    slug: "questions",
                    content: "I don't know!"
                }, options2));

                yield httpRequest.post(`${ADMIN_URL}/posts`, Object.assign({
                    title: "Favourite Food",
                    slug: "favourite-food",
                    content: "I like miso soup and beef stew."
                }, options2));

                yield httpRequest.post(`${ADMIN_URL}/posts`, Object.assign({
                    title: "Abstract Food",
                    slug: "abstract-food",
                    content: "Diet Food"
                }, options2));

                let json = yield httpRequest.get(`${ADMIN_URL}/posts/?query={"slug":"questions"}`);
                let posts = json.items;

                expect(posts.length).to.equal(1);
                expect(posts[0].title).to.equal("Questions about Life");

                json = yield httpRequest.get(`${ADMIN_URL}/posts/?skip=1&limit=2&sort={"slug":1}`);
                posts = json.items;

                expect(posts.length).to.equal(2);
                expect(posts[0].title).to.equal("Favourite Food");
                expect(posts[1].title).to.equal("Intro to Javascript");

                done();
            }).catch((e) =>
            {
                done(e);
            });
        });

    });
};
