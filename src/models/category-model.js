import { MongoModel } from 'simple-odm';
import schema from './category-schema';

export default class CategoryModel extends MongoModel {

    static get name () {
        return schema.name;
    }

    static get schema () {
        return schema;
    }

}