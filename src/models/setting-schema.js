import validator from 'validator';
import { types, eventHub } from 'simple-odm';
import { WeblogJsSchema, modifyDateData } from './weblogjs-schema';

const schema = new WeblogJsSchema({

    name: 'setting',

    paths: {
        name: {
            required: true,
            type: types.String,
            default_value: "Default Blog",
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

        posts_per_page: {
            required: true,
            display_name: "posts per page",
            type: types.Integer,
            default_value: 1,
            validate: function* (value)
            {
                const range = {min: 1, max: 20};
                if (value < range.min || range.max < value)
                {
                    yield `A ${this.displayName} should be between ${range.min} and ${range.max}.`;
                }
            }
        },

        theme: {
            required: true,
            type: types.String,
            default_value: "default",
            sanitize: (value) => value.trim()
        }
    }
});

eventHub.on(schema.BEFORE_SAVED, modifyDateData);

export default schema;