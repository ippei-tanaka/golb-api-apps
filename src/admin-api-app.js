import express, {Router} from "express";
import pluralize from 'pluralize';
import PassportManager from './passport-manager';
import UserModel from './models/user-model';
import CategoryModel from './models/category-model';
import PostModel from './models/post-model';
import SettingModel from './models/setting-model';
import setUpDbConnection from './models/setup-db-connection';
import {ObjectID} from 'mongodb';
import {UNAUTHORIZED, BAD_REQUEST, OK} from './status-codes';
import {parse} from './parameter-parser';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import expressSession from 'express-session';
import {AuthenticationError, AuthorizationError} from './errors';

/**
 * Express Middleware Callbacks
 */

const bypass = (request, response, next) => next();

const isLoggedIn = (request, response, next) =>
{
    if (request.isAuthenticated())
        return next();

    response.type('json').status(UNAUTHORIZED).json(new AuthorizationError({}));
};

const isLoggedOut = (request, response, next) =>
{
    if (!request.isAuthenticated())
        return next();

    response.type('json').status(UNAUTHORIZED).json(new AuthorizationError({}));
};

const logIn = (...args) =>
{
    const [request, response] = args;

    (async () =>
    {
        const foundUser = await UserModel.findOne({email: request.body.email});

        if (!foundUser)
        {
            response.type('json').status(BAD_REQUEST).json(new AuthenticationError({
                email: [`The email , "${request.body.email}", is not registered.`]
            }));
            return;
        }

        const [authenticationError, authenticatedUser] = await new Promise((resolve) => {
            PassportManager.authenticate((error, user) => {
                resolve([error, user]);
            })(...args);
        });

        if (authenticationError)
        {
            response.type('json').status(BAD_REQUEST).json(authenticationError);
            return;
        }

        if (!authenticatedUser)
        {
            response.type('json').status(BAD_REQUEST).json(new AuthenticationError({
                password: ["The submitted password is wrong."]
            }));
            return;
        }

        const loginProcessError = await new Promise((resolve) => {
            request.login(authenticatedUser, (error) => resolve(error));
        });

        if (loginProcessError)
        {
            response.type('json').status(BAD_REQUEST).json(loginProcessError);
            return;
        }

        response.type('json').status(OK).json({});

    })();
};

const logOut = (request, response) =>
{
    try
    {
        request.logout(new AuthenticationError({}));
    }
    catch (e)
    {
        response.type('json').status(BAD_REQUEST).json({});
        return;
    }

    response.type('json').status(OK).json({});
};

const respond = (asyncFn = async () => {}) =>
{
    return (request, response, next) =>
    {
        asyncFn(request, response, next)
            .then((data = {}) =>
            {
                response.type('json').status(OK).json(data);
            })
            .catch((error = {}) =>
            {
                response.type('json').status(BAD_REQUEST).json(error);
            });
    };
};

const createRouterForCrudOperations = (Model) =>
{
    const router = new Router();
    const path = pluralize(Model.name);

    router.get(`/${path}`, isLoggedIn, respond(async (request) =>
    {
        const {query, sort, limit, skip} = parse(request.url);
        const models = await Model.findMany({query, sort, limit, skip});
        return {items: models};
    }));

    router.get(`/${path}/:id`, isLoggedIn, respond(async (request) =>
    {
        return await Model.findOne({_id: new ObjectID(request.params.id)});
    }));

    router.post(`/${path}`, isLoggedIn, respond(async (request) =>
    {
        const model = new Model(request.body);
        await model.save();
        return {_id: model.id};
    }));

    router.put(`/${path}/:id`, isLoggedIn, respond(async (request) =>
    {
        const model = await Model.findOne({_id: new ObjectID(request.params.id)});

        if (model)
        {
            Object.assign(model.values, request.body);
            await model.save();
        }
    }));

    router.delete(`/${path}/:id`, isLoggedIn, respond(async (request) =>
    {
        await Model.deleteOne({_id: new ObjectID(request.params.id)});
    }));

    return router;
};

const createRouterForAuth = () =>
{
    const router = new Router();

    router.post('/login', isLoggedOut, logIn);

    router.get('/logout', isLoggedIn, logOut);

    return router;
};

const createRouterForHome = () =>
{
    const router = new Router();

    router.get(`/`, respond());

    return router;
};

const createRouterForUser = () =>
{
    const router = new Router();

    router.get(`/users/me`, isLoggedIn, respond(async (request) =>
    {
        if (request.user)
        {
            return await UserModel.findOne({_id: new ObjectID(request.user._id)});
        }
        else
        {
            throw new AuthenticationError({email: "The email isn't registered."});
        }
    }));

    router.put(`/users/:id/password`, isLoggedIn, respond(async (request) =>
    {
        const model = await UserModel.findOne({_id: new ObjectID(request.params.id)});

        if (model)
        {
            Object.assign(model.values, request.body, {password_update: true});
            await model.save();
        }

    }));

    return router;
};

const createRoutesForSetting = () =>
{
    const router = new Router();

    router.get(`/setting`, isLoggedIn, respond(async () =>
    {
        return await SettingModel.getSetting();
    }));

    router.put(`/setting`, isLoggedIn, respond(async (request) =>
    {
        await SettingModel.setSetting(request.body);
    }));

    return router;
};


export default class AdminApiApp {

    constructor ({sessionSecret, dbHost, dbPort, dbName})
    {
        setUpDbConnection({dbHost, dbPort, dbName});

        const app = express();

        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({extended: false}));
        app.use(cookieParser());
        app.use(expressSession({
            secret: sessionSecret,
            resave: true,
            saveUninitialized: true
        }));

        app.use(PassportManager.initialize());
        app.use(PassportManager.session());

        // The order of those functions matters.

        app.use(createRouterForHome());
        app.use(createRouterForAuth());
        app.use(createRouterForUser());
        app.use(createRouterForCrudOperations(UserModel));
        app.use(createRouterForCrudOperations(CategoryModel));
        app.use(createRouterForCrudOperations(PostModel));
        app.use(createRoutesForSetting());

        // adding class methods to the express app

        for (let propName of Object.getOwnPropertyNames(this.constructor.prototype))
        {
            if (propName === "constructor") continue;
            app[propName] = this[propName].bind(this);
        }

        return app;
    }

    async insertUser ({email, password, display_name, slug})
    {
        const user = await UserModel.findOne({email});

        if (!user)
        {
            await new UserModel({email, password, display_name, slug}).save();
        }
    }

};