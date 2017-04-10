'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _passport = require('passport');

var _passport2 = _interopRequireDefault(_passport);

var _passportLocal = require('passport-local');

var _mongodb = require('mongodb');

var _userModel = require('./models/user-model');

var _userModel2 = _interopRequireDefault(_userModel);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var localAuth = _passport2.default.authenticate('local');

_passport2.default.use(new _passportLocal.Strategy({ usernameField: 'email' }, function (email, password, done) {
    return function _callee() {
        var model;
        return _regenerator2.default.async(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        _context.next = 2;
                        return _regenerator2.default.awrap(_userModel2.default.findOne({ email: email }));

                    case 2:
                        model = _context.sent;

                        if (model) {
                            _context.next = 5;
                            break;
                        }

                        return _context.abrupt('return', done());

                    case 5:
                        _context.next = 7;
                        return _regenerator2.default.awrap(model.checkPassword(password));

                    case 7:
                        if (_context.sent) {
                            _context.next = 9;
                            break;
                        }

                        return _context.abrupt('return', done());

                    case 9:
                        return _context.abrupt('return', done(null, model.values));

                    case 10:
                    case 'end':
                        return _context.stop();
                }
            }
        }, null, undefined);
    }().catch(function (e) {
        return console.error(e);
    });
}));

_passport2.default.serializeUser(function (user, done) {
    done(null, user._id);
});

_passport2.default.deserializeUser(function (_id, done) {
    return function _callee2() {
        var model;
        return _regenerator2.default.async(function _callee2$(_context2) {
            while (1) {
                switch (_context2.prev = _context2.next) {
                    case 0:
                        _context2.next = 2;
                        return _regenerator2.default.awrap(_userModel2.default.findOne({ _id: new _mongodb.ObjectID(_id) }));

                    case 2:
                        model = _context2.sent;

                        if (model) {
                            _context2.next = 5;
                            break;
                        }

                        return _context2.abrupt('return', done());

                    case 5:
                        return _context2.abrupt('return', done(null, model.values));

                    case 6:
                    case 'end':
                        return _context2.stop();
                }
            }
        }, null, undefined);
    }().catch(function (e) {
        return console.error(e);
    });
});

exports.default = {

    get passport() {
        return _passport2.default;
    },

    get localAuth() {
        return localAuth;
    }

};
module.exports = exports['default'];