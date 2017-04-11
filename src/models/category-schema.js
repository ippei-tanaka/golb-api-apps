import validator from 'validator';
import { types, eventHub } from 'simple-odm';
import { SuperSchema, updateTimestampFields } from './super-schema';

const schema = new SuperSchema({

    name: 'category',

    paths: {

        name: {
            required: true,
            type: types.String,
            sanitize: (value) => value.trim(),
            validate: function* (value)
            {
                const range = {min: 1, max: 200};
                if (!validator.isLength(value, range))
                {
                    yield `A ${this.name} should be between ${range.min} and ${range.max} characters.`;
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
                    yield `A ${this.name} should be between ${range.min} and ${range.max} characters.`;
                }

                if (!validator.matches(value, /^[a-zA-Z0-9\-_]*$/))
                {
                    yield `Only alphabets, numbers and some symbols (-, _) are allowed for a ${this.displayName}.`;
                }
            }
        }
    }
});

eventHub.on(schema.BEFORE_SAVED, updateTimestampFields);

export default schema;