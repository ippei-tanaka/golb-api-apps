import passport from 'passport';
import {Strategy as LocalStrategy} from 'passport-local';
import {ObjectID} from 'mongodb';
import UserModel from './models/user-model';

passport.use(new LocalStrategy({usernameField: 'email'}, async (email, password, done) =>
{
    const model = await UserModel.findOne({email});

    if (!model)
    {
        return done(null, false, {message: "User not found"});
    }

    if (!(await model.checkPassword(password)))
    {
        return done(null, false, {message: "Wrong password"});
    }

    return done(null, model.values);
}));

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

    initialize: () =>
    {
        return passport.initialize();
    },

    session: () =>
    {
        return passport.session();
    },

    authenticate: (callback) =>
    {
        return passport.authenticate('local', callback);
    }
}