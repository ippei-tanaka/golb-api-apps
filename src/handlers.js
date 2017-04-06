import { SyntaxError } from './errors';
import url from 'url';
import { SimpleOdmValidationError } from 'simple-odm'

export const bypass = (request, response, next) => next();

export const isLoggedIn = (request, response, next) =>
{
    if (request.isAuthenticated())
        return next();

    response.sendStatus(401);
};

export const isLoggedOut = (request, response, next) =>
{
    if (!request.isAuthenticated())
        return next();

    response.sendStatus(401);
};

export const successHandler = (response, obj, code = 200) =>
{
    response.type('json').status(code).json(obj);
};

export const errorHandler = (response, code = 400) =>
{
    return error =>
    {

        if (error instanceof SimpleOdmValidationError)
        {
            response.type('json').status(code).json(error.message);
        }
        else
        {
            if (error && error.stack) console.error(error.stack);

            response.type('json').status(code).json(error);
        }
    }
};

export const parseParameters = (_url) =>
{
    const obj = url.parse(_url, true);

    const params = Object.assign({
        query: "{}",
        sort: "{}",
        limit: "0",
        skip: "0"
    }, obj.query);

    let query, sort, limit, skip;

    try
    {
        query = JSON.parse(params.query);

        if (typeof query !== "object")
            throw null;

        for (let key of Object.keys(query))
        {
            const val = query[key];
            if (typeof val !== "string"
                && typeof val !== "number")
            {
                throw null;
            }
        }
    }
    catch (error)
    {
        throw new SyntaxError("The query parameter is invalid.");
    }

    try
    {
        sort = JSON.parse(params.sort);

        if (typeof sort !== "object")
            throw null;

        for (let key of Object.keys(sort))
        {
            const val = sort[key];
            if (val !== 1 && val !== -1)
            {
                throw null;
            }
        }
    }
    catch (error)
    {
        throw new SyntaxError("THe sort parameter is invalid.");
    }

    try
    {
        limit = Number.parseInt(params.limit);
        if (Number.isNaN(limit)) throw null;
    }
    catch (error)
    {
        throw new SyntaxError("The limit parameter is invalid.");
    }

    try
    {
        skip = Number.parseInt(params.skip);
        if (Number.isNaN(skip)) throw null;
    }
    catch (error)
    {
        throw new SyntaxError("The offset parameter is invalid.");
    }

    return {query, sort, limit, skip};
};