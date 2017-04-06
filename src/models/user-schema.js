import co from 'co';
import validator from 'validator';
import compareHashedStrings from '../utilities/compare-hashed-strings';
import generateHash from '../utilities/generate-hash';
import { types, eventHub } from 'simple-odm';
import { WeblogJsSchema, modifyDateData } from './weblogjs-schema';

const paths = {

    email: {
        unique: true,
        required: true,
        type: types.String,
        sanitize: (value) => validator.normalizeEmail(value),
        validate: function* (value)
        {
            if (!validator.isEmail(value))
            {
                yield `A ${this.name} should be a valid email.`;
            }
        }
    },

    password: {
        required: ['created'],
        type: types.String,
        projected: false,
        validate: function* (value)
        {
            const range = {min: 8, max: 16};
            if (!validator.isLength(value, range))
            {
                yield `A ${this.name} should be between ${range.min} and ${range.max} characters.`;
            }

            if (!validator.matches(value, /^[a-zA-Z0-9#!@%&\*]*$/))
            {
                yield `Only alphabets, numbers and some symbols (#, !, @, %, &, *) are allowed for a ${this.name}.`;
            }
        }
    },

    display_name: {
        display_name: "display name",
        required: true,
        type: types.String,
        sanitize: (value) => value.trim(),
        validate: function* (value)
        {
            const range = {min: 1, max: 20};
            if (!validator.isLength(value, range))
            {
                yield `A ${this.name} should be between ${range.min} and ${range.max} characters.`;
            }

            if (!validator.matches(value, /^[a-zA-Z0-9_\-#!@%&\* ]*$/))
            {
                yield `Only alphabets, numbers, spaces and some symbols (_, -, #, !, @, %, &, *) are allowed for a ${this.name}.`;
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
                yield `Only alphabets, numbers and some symbols (-, _) are allowed for a ${this.name}.`;
            }
        }
    }
};

const HASHED_PASSWORD = "hashed_password";
const OLD_PASSWORD = "old_password";
const PASSWORD_UPDATE = "password_update";
const PASSWORD = "password";
const PASSWORD_CONFIRMED = "password_confirmed";

class UserSchema extends WeblogJsSchema {

    /**
     * @override
     */
    constructor ()
    {
        super({name: 'user', paths});
    }

}

const schema = new UserSchema();

eventHub.on(schema.BEFORE_SAVED, modifyDateData);

const onUpdate = ({errors, values, initialValues}) => co(function* ()
{
    const _values = Object.assign({}, values);
    const _errors = Object.assign({}, errors);

    delete _values[PASSWORD];
    delete _values[OLD_PASSWORD];
    delete _values[PASSWORD_UPDATE];
    delete _values[PASSWORD_CONFIRMED];

    if (values[PASSWORD_UPDATE])
    {
        if (!values.hasOwnProperty(PASSWORD) || !values[PASSWORD])
        {
            _errors[PASSWORD] = ["The new password is required."];
        }

        if (!values.hasOwnProperty(OLD_PASSWORD) || !values[OLD_PASSWORD])
        {
            _errors[OLD_PASSWORD] = ["The current password is required."];
        }

        if (!values.hasOwnProperty(PASSWORD_CONFIRMED) || !values[PASSWORD_CONFIRMED])
        {
            _errors[PASSWORD_CONFIRMED] = ["The confirmed password is required."];
        }

        if (values.hasOwnProperty(PASSWORD_CONFIRMED)
            && values[PASSWORD_CONFIRMED] !== ""
            && values[PASSWORD] !== values[PASSWORD_CONFIRMED])
        {
            _errors[PASSWORD_CONFIRMED] = ['The confirmed password sent is not the same as the new password.'];
        }

        if (values.hasOwnProperty(OLD_PASSWORD) && values[OLD_PASSWORD] !== "")
        {
            const result = yield compareHashedStrings(values[OLD_PASSWORD], initialValues[HASHED_PASSWORD]);
            if (!result)
            {
                _errors[OLD_PASSWORD] = ["The current password sent is not correct."];
            }
        }

        if (Object.keys(_errors).length === 0)
        {
            _values[HASHED_PASSWORD] = yield generateHash(values[PASSWORD]);
        }
    }
    else
    {
        if (values.hasOwnProperty(PASSWORD) && values[PASSWORD])
        {
            _errors[PASSWORD] = ["The password can't be updated."];
        }
    }

    return {
        values: _values,
        errors: _errors
    };
});

const onCreate = ({errors, values, initialValues}) => co(function* ()
{
    const _values = Object.assign({}, values);

    delete _values[PASSWORD];
    delete _values[OLD_PASSWORD];
    delete _values[PASSWORD_UPDATE];
    delete _values[PASSWORD_CONFIRMED];

    if (!errors[PASSWORD]
        || !Array.isArray(errors[PASSWORD])
        || errors[PASSWORD].length === 0)
    {
        _values[HASHED_PASSWORD] = yield generateHash(values[PASSWORD]);
    }

    return {values: _values};
});

eventHub.on(schema.BEFORE_SAVED, ({errors, values, initialValues}) =>
{
    return !values._id ? onCreate({errors, values, initialValues}) : onUpdate({errors, values, initialValues});
});

export default schema;