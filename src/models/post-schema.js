import validator from 'validator';
import { types, eventHub } from 'simple-odm';
import { WeblogJsSchema, modifyDateData } from './weblogjs-schema';

const schema = new WeblogJsSchema({
    name: 'post', paths: {

        title: {
            required: true,
            type: types.String,
            sanitize: (value) => value.trim(),
            validate: function* (value)
            {
                const range = {min: 1, max: 200};
                if (!validator.isLength(value, range))
                {
                    yield `A ${this.displayName} should be between ${range.min} and ${range.max} characters.`;
                }
            }
        },

        slug: {
            unique: true,
            required: true,
            type: types.String,
            sanitize: (value) => value.trim(),
            validate: function* (value)
            {
                const range = {min: 1, max: 200};
                if (!validator.isLength(value, range))
                {
                    yield `A ${this.displayName} should be between ${range.min} and ${range.max} characters.`;
                }

                if (!validator.matches(value, /^[a-zA-Z0-9\-_]*$/))
                {
                    yield `Only alphabets, numbers and some symbols (-, _) are allowed for a ${this.name}.`;
                }
            }
        },

        content: {
            required: true,
            type: types.String,
            validate: function* (value)
            {
                const range = {min: 1, max: 30000};
                if (!validator.isLength(value, range))
                {
                    yield `A ${this.displayName} should be between ${range.min} and ${range.max} characters.`;
                }
            }
        },

        author_id: {
            required: true,
            display_name: "author ID",
            type: types.MongoObjectID,
            validate: function* (value)
            {
                if (value === null || value === undefined) {
                    return;
                }

                if (!value)
                {
                    yield `"${value}" is an invalid ID.`
                }
            }
        },

        category_id: {
            display_name: "category ID",
            type: types.MongoObjectID,
            validate: function* (value)
            {
                if (value === null || value === undefined) {
                    return;
                }

                if (!value)
                {
                    yield `"${value}" is an invalid ID.`
                }
            }
        },

        tags: {
            type: [types.String],
            validate: function* (value)
            {
                if (value === null || value === undefined) {
                    return;
                }

                const range = {min: 1, max: 100};

                for (let item of value)
                {
                    if (!validator.isLength(item, range))
                    {
                        yield `A tag should be between ${range.min} and ${range.max} characters.`;
                    }
                }
            }
        },

        published_date: {
            type: types.Date
        },

        is_draft: {
            type: types.Boolean
        }

    }
});

eventHub.on(schema.BEFORE_SAVED, modifyDateData);

export default schema;