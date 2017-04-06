import { MongoModel } from 'simple-odm';
import schema from './user-schema';
import compareHashedStrings from '../utilities/compare-hashed-strings';

require('./setup-db-connection');

export default class UserModel extends MongoModel {

    static get name () {
        return schema.name;
    }

    static get schema () {
        return schema;
    }

    checkPassword (password)
    {
        return compareHashedStrings(password, this.values.hashed_password);
    }

}