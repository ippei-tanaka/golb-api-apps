import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { ObjectID } from 'mongodb';
import UserModel from './models/user-model';

const localAuth = passport.authenticate('local');

passport.use(new LocalStrategy({usernameField: 'email'}, (email, password, done) => (async () =>
{
    const model = await UserModel.findOne({email});

    if (!model)
    {
        return done();
    }

    if (!(await model.checkPassword(password)))
    {
        return done();
    }

    return done(null, model.values);

})().catch(e => console.error(e))));

passport.serializeUser((user, done) =>
{
    done(null, user._id);
});

passport.deserializeUser((_id, done) => (async () =>
{
    const model = await UserModel.findOne({_id: new ObjectID(_id)});

    if (!model)
    {
        return done();
    }

    return done(null, model.values);

})().catch(e => console.error(e)));

export default {

    get passport ()
    {
        return passport;
    },

    get localAuth ()
    {
        return localAuth;
    }

}