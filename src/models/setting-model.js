import co from 'co';
import { MongoModel } from 'simple-odm';
import schema from './setting-schema';

require('./setup-db-connection');

export default class SettingModel extends MongoModel {

    static get name () {
        return schema.name;
    }

    static get schema () {
        return schema;
    }

    static findMany () {
        return undefined;
    }

    static findOne () {
        return undefined;
    }

    static getSetting () {
        const findOne = super.findOne.bind(this);

        return co(function* () {
            const model = yield findOne();

            if (model) {
                return model;
            } else {
                yield this.setSetting({});
                return yield findOne();
            }
        }.bind(this));
    }

    static setSetting (values) {
        const findOne = super.findOne.bind(this);

        return co(function* () {
            let model = yield findOne();

            if (model) {
                Object.assign(model.values, values);
                yield model.save();
            } else {
                model = new this(values);
                yield model.save();
            }
        }.bind(this));
    }
}