import { MongoModel } from 'simple-odm';
import schema from './setting-schema';

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

        return (async () => {
            const model = await findOne();

            if (model) {
                return model;
            } else {
                await this.setSetting({});
                return await findOne();
            }
        })();
    }

    static setSetting (values) {
        const findOne = super.findOne.bind(this);

        return (async () => {
            let model = await findOne();

            if (model) {
                Object.assign(model.values, values);
                await model.save();
            } else {
                model = new this(values);
                await model.save();
            }
        })();
    }
}