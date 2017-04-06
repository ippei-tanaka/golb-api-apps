import { MongoSchema, types } from 'simple-odm';

const commonPaths = {

    created_date: {
        type: types.Date
    },

    updated_date: {
        type: types.Date
    }

};

export class WeblogJsSchema extends MongoSchema {

    /**
     * @override
     */
    constructor (arg)
    {
        arg.paths = Object.assign({}, arg.paths, commonPaths);
        super(arg);
    }

}

export const modifyDateData = ({values}) =>
{
    const _values = Object.assign({}, values);

    if (!values._id)
    {
        _values.created_date = new Date();
        _values.updated_date = null;
    }
    else
    {
        _values.updated_date = new Date();
    }

    return {values: _values};
};