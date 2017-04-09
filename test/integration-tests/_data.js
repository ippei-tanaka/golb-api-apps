export const admin = Object.freeze(Object.assign({
    email: "ttt@ttt.com",
    password: "tttttttt",
    display_name: "Admin",
    slug: 'admin'
}));

export const testUser = Object.freeze({
    "email": "email1@example.com",
    "password": "test1234",
    "slug": "slug-test1234",
    "display_name": "Test User 1"
});

export const testCategory = Object.freeze({
    "name": "Oh My Category",
    "slug": "oh-my-category"
});

export const testPost = Object.freeze({
    "title": "My Post",
    "slug": "my-post",
    "content": "Hello, world!",
    "tags": ["tag1", "tag2", "tag3"],
    "published_date": new Date(),
    "is_draft": false
});

export const settings = {
    webHost: "localhost",
    webPort: 3004,
    dbName: "weblogjstest",
    adminEmail: admin.email,
    adminPassword: admin.password,
    adminDisplayName: admin.display_name,
    adminSlug: admin.slug
};