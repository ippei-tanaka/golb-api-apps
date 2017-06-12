import express, {Router} from "express";
import {OK, NOT_FOUND} from './status-codes';
import UserModel from './models/user-model';
import CategoryModel from './models/category-model';
import PostModel from './models/post-model';
import SettingModel from './models/setting-model';
import setUpDbConnection from './models/setup-db-connection';
import urlResolver from "./utilities/url-resolver";
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';

const parseParam = (str, defaultValue) =>
{
    const arr = str ? str.split('/') : [];
    return arr.length >= 3 && arr[2] ? arr[2] : defaultValue;
};

const pageLinkBuilder = ({page, author, category, tag}) =>
{
    if (!Number.isInteger(page))
    {
        return null;
    }

    const authorQuery = author ? `author/${author.slug}` : "";
    const categoryQuery = category ? `category/${category.slug}` : "";
    const tagQuery = tag ? `tag/${tag}` : "";
    const pageQuery = page > 1 ? `page/${page}` : "";

    return urlResolver.resolve("posts", authorQuery, categoryQuery, tagQuery, pageQuery);
};

const getUsedCategories = async () =>
{
    const categorySums = await PostModel.aggregate([
        {
            $match: {
                category_id: {$ne: null},
                published_date: {$lt: new Date()},
                is_draft: {$ne: true}
            }
        },
        {
            $group: {
                _id: "$category_id",
                size: {$sum: 1}
            }
        }
    ]);

    const categoryModels = await CategoryModel.findMany({
        query: {_id: {$in: categorySums.map(obj => obj._id)}}
    });

    return categoryModels.map((model) =>
    {
        const values = model.values;
        const sumObj = categorySums.find(obj => obj._id.equals(values._id));
        return Object.assign({}, values, {size: sumObj.size});
    });
};


const getSettings = async () =>
{
    return (await SettingModel.getSetting()).values;
};

const createMultiplePostsRouter = () =>
{
    const router = Router();

    router.get(/^(\/category\/[^/]+)?(\/author\/[^/]+)?(\/tag\/[^/]+)?\/?posts\/?(\/|\/page\/[0-9]+\/?)?$/,

        async (request, response) =>
        {
            const categorySlug = parseParam(request.params[0], null);
            const authorSlug = parseParam(request.params[1], null);
            const tag = parseParam(request.params[2], null);
            const page = parseParam(request.params[3], 1);

            let _query = {
                published_date: {$lt: new Date()},
                is_draft: {$ne: true}
            };

            if (tag)
            {
                _query.tags = {$in: [tag]};
            }

            const categoryModel = await CategoryModel.findOne({slug: categorySlug});
            const category = categoryModel ? categoryModel.values : null;

            if (category)
            {
                _query.category_id = category._id;
            }

            const userModel = await UserModel.findOne({slug: authorSlug});
            const author = userModel ? userModel.values : null;

            if (author)
            {
                _query.author_id = author._id;
            }

            const setting = (await SettingModel.getSetting()).values;

            const postModels = await PostModel.findMany({
                query: _query,
                sort: {published_date: -1, created_date: 1},
                skip: setting.posts_per_page * (page - 1),
                limit: setting.posts_per_page
            });

            const sums = await PostModel.aggregate([
                {
                    $match: _query
                },
                {
                    $group: {
                        _id: null,
                        size: {$sum: 1}
                    }
                }
            ]);

            let totalPages = 0;

            if (sums.length > 0)
            {
                const sum = sums[0];
                totalPages = Math.ceil(sum.size / setting.posts_per_page);
            }

            const prevPage = 1 <= page - 1 ? page - 1 : null;
            const nextPage = page + 1 <= totalPages ? page + 1 : null;

            response.type('json').status(OK).send({
                posts: postModels.map(m => m.values),
                prevPageLink: pageLinkBuilder({page: prevPage, category, author, tag}),
                nextPageLink: pageLinkBuilder({page: nextPage, category, author, tag})
            });
        });

    return router;

};

const createSinglePostRouter = () =>
{
    const router = Router();

    router.get(/^\/post\/([^/]+)\/?$/, async (request, response, next) =>
    {
        const postSlug = request.params[0];

        const post = await PostModel.findOne({
            slug: postSlug,
            published_date: {$lt: new Date()},
            is_draft: {$ne: true}
        });

        if (!post)
        {
            return next();
        }

        response.type('json').status(OK).send(post);
    });

    return router;
};

const createUsedCategoriesRouter = () =>
{
    const router = Router();

    router.get(/^\/categories\/?$/,

        async (request, response) =>
        {
            response.type('json').status(OK).send({
                categories: await getUsedCategories()
            });
        });

    return router;
};

const createSettingsRouter = () =>
{
    const router = Router();

    router.get(/^\/settings\/?$/,

        async (request, response) =>
        {
            response.type('json').status(OK).send(await getSettings());
        });

    return router;
};

const createNotFoundRouter = () =>
{
    const router = Router();

    router.get("*", async (request, response) =>
    {
        response.type('json').status(NOT_FOUND).send({});
    });

    return router;
};

export default class PublicApiApp {

    constructor ({dbHost, dbPort, dbName})
    {
        setUpDbConnection({dbHost, dbPort, dbName});

        const app = express();

        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({extended: false}));
        app.use(cookieParser());
        app.use(createMultiplePostsRouter());
        app.use(createUsedCategoriesRouter());
        app.use(createSinglePostRouter());
        app.use(createSettingsRouter());
        app.use(createNotFoundRouter());

        // adding class methods to the express app

        for (let propName of Object.getOwnPropertyNames(this.constructor.prototype))
        {
            if (propName === "constructor") continue;
            app[propName] = this[propName].bind(this);
        }

        return app;
    }

}