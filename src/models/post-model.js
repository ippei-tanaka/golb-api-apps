import { MongoModel } from 'simple-odm';
import schema from './post-schema';

require('./setup-db-connection');

export default class PostModel extends MongoModel {

    static get name () {
        return schema.name;
    }

    static get schema () {
        return schema;
    }

}