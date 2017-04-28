import { SyntaxError } from './errors';
import url from 'url';

export const parse = (_url) =>
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