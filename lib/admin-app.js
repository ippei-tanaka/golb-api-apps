'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _pluralize = require('pluralize');

var _pluralize2 = _interopRequireDefault(_pluralize);

var _passportManager = require('./passport-manager');

var _passportManager2 = _interopRequireDefault(_passportManager);

var _userModel = require('./models/user-model');

var _userModel2 = _interopRequireDefault(_userModel);

var _categoryModel = require('./models/category-model');

var _categoryModel2 = _interopRequireDefault(_categoryModel);

var _postModel = require('./models/post-model');

var _postModel2 = _interopRequireDefault(_postModel);

var _settingModel = require('./models/setting-model');

var _settingModel2 = _interopRequireDefault(_settingModel);

var _mongodb = require('mongodb');

var _handlers = require('./handlers');

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _cookieParser = require('cookie-parser');

var _cookieParser2 = _interopRequireDefault(_cookieParser);

var _expressSession = require('express-session');

var _expressSession2 = _interopRequireDefault(_expressSession);

var _config = require('./config');

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//import fs from 'fs';
//import path from 'path';
var addRoutesForCrudOperations = function addRoutesForCrudOperations(Model, app, filter) {
    var path = (0, _pluralize2.default)(Model.name);

    app.get('/' + path, filter, function (request, response) {
        return function _callee() {
            var _parseParameters, query, sort, limit, skip, models;

            return _regenerator2.default.async(function _callee$(_context) {
                while (1) {
                    switch (_context.prev = _context.next) {
                        case 0:
                            _parseParameters = (0, _handlers.parseParameters)(request.url), query = _parseParameters.query, sort = _parseParameters.sort, limit = _parseParameters.limit, skip = _parseParameters.skip;
                            _context.next = 3;
                            return _regenerator2.default.awrap(Model.findMany({ query: query, sort: sort, limit: limit, skip: skip }));

                        case 3:
                            models = _context.sent;

                            (0, _handlers.successHandler)(response, { items: models });

                        case 5:
                        case 'end':
                            return _context.stop();
                    }
                }
            }, null, undefined);
        }().catch((0, _handlers.errorHandler)(response));
    });

    app.get('/' + path + '/:id', filter, function (request, response) {
        return function _callee2() {
            var model;
            return _regenerator2.default.async(function _callee2$(_context2) {
                while (1) {
                    switch (_context2.prev = _context2.next) {
                        case 0:
                            _context2.next = 2;
                            return _regenerator2.default.awrap(Model.findOne({ _id: new _mongodb.ObjectID(request.params.id) }));

                        case 2:
                            model = _context2.sent;

                            (0, _handlers.successHandler)(response, model);

                        case 4:
                        case 'end':
                            return _context2.stop();
                    }
                }
            }, null, undefined);
        }().catch((0, _handlers.errorHandler)(response));
    });

    app.post('/' + path, filter, function (request, response) {
        return function _callee3() {
            var model;
            return _regenerator2.default.async(function _callee3$(_context3) {
                while (1) {
                    switch (_context3.prev = _context3.next) {
                        case 0:
                            model = new Model(request.body);
                            _context3.next = 3;
                            return _regenerator2.default.awrap(model.save());

                        case 3:
                            (0, _handlers.successHandler)(response, { _id: model.id });

                        case 4:
                        case 'end':
                            return _context3.stop();
                    }
                }
            }, null, undefined);
        }().catch((0, _handlers.errorHandler)(response));
    });

    app.put('/' + path + '/:id', filter, function (request, response) {
        return function _callee4() {
            var model;
            return _regenerator2.default.async(function _callee4$(_context4) {
                while (1) {
                    switch (_context4.prev = _context4.next) {
                        case 0:
                            _context4.next = 2;
                            return _regenerator2.default.awrap(Model.findOne({ _id: new _mongodb.ObjectID(request.params.id) }));

                        case 2:
                            model = _context4.sent;

                            if (!model) {
                                _context4.next = 7;
                                break;
                            }

                            (0, _assign2.default)(model.values, request.body);
                            _context4.next = 7;
                            return _regenerator2.default.awrap(model.save());

                        case 7:
                            (0, _handlers.successHandler)(response, {});

                        case 8:
                        case 'end':
                            return _context4.stop();
                    }
                }
            }, null, undefined);
        }().catch((0, _handlers.errorHandler)(response));
    });

    app.delete('/' + path + '/:id', filter, function (request, response) {
        return function _callee5() {
            return _regenerator2.default.async(function _callee5$(_context5) {
                while (1) {
                    switch (_context5.prev = _context5.next) {
                        case 0:
                            _context5.next = 2;
                            return _regenerator2.default.awrap(Model.deleteOne({ _id: new _mongodb.ObjectID(request.params.id) }));

                        case 2:
                            (0, _handlers.successHandler)(response, {});

                        case 3:
                        case 'end':
                            return _context5.stop();
                    }
                }
            }, null, undefined);
        }().catch((0, _handlers.errorHandler)(response));
    });

    return app;
};

var addRoutesForAuth = function addRoutesForAuth(app, loginCheck, logoutCheck, authentication) {
    app.post('/login', logoutCheck, authentication, function (request, response) {
        (0, _handlers.successHandler)(response, {});
    });

    app.get('/logout', loginCheck, function (request, response) {
        request.logout();
        (0, _handlers.successHandler)(response, {});
    });

    return app;
};

var addRoutesForHome = function addRoutesForHome(app) {
    app.get('/', function (request, response) {
        return function _callee6() {
            return _regenerator2.default.async(function _callee6$(_context6) {
                while (1) {
                    switch (_context6.prev = _context6.next) {
                        case 0:
                            (0, _handlers.successHandler)(response, {});

                        case 1:
                        case 'end':
                            return _context6.stop();
                    }
                }
            }, null, undefined);
        }().catch((0, _handlers.errorHandler)(response));
    });

    return app;
};

var addRoutesForUser = function addRoutesForUser(app, filter) {
    app.get('/users/me', filter, function (request, response) {
        return function _callee7() {
            var model;
            return _regenerator2.default.async(function _callee7$(_context7) {
                while (1) {
                    switch (_context7.prev = _context7.next) {
                        case 0:
                            if (!request.user) {
                                _context7.next = 7;
                                break;
                            }

                            _context7.next = 3;
                            return _regenerator2.default.awrap(_userModel2.default.findOne({ _id: new _mongodb.ObjectID(request.user._id) }));

                        case 3:
                            model = _context7.sent;

                            (0, _handlers.successHandler)(response, model);
                            _context7.next = 8;
                            break;

                        case 7:
                            (0, _handlers.successHandler)(response, null);

                        case 8:
                        case 'end':
                            return _context7.stop();
                    }
                }
            }, null, undefined);
        }().catch((0, _handlers.errorHandler)(response));
    });

    app.put('/users/:id/password', filter, function (request, response) {
        return function _callee8() {
            var model;
            return _regenerator2.default.async(function _callee8$(_context8) {
                while (1) {
                    switch (_context8.prev = _context8.next) {
                        case 0:
                            _context8.next = 2;
                            return _regenerator2.default.awrap(_userModel2.default.findOne({ _id: new _mongodb.ObjectID(request.params.id) }));

                        case 2:
                            model = _context8.sent;

                            if (!model) {
                                _context8.next = 7;
                                break;
                            }

                            (0, _assign2.default)(model.values, request.body, { password_update: true });
                            _context8.next = 7;
                            return _regenerator2.default.awrap(model.save());

                        case 7:

                            (0, _handlers.successHandler)(response, {});

                        case 8:
                        case 'end':
                            return _context8.stop();
                    }
                }
            }, null, undefined);
        }().catch((0, _handlers.errorHandler)(response));
    });

    return app;
};

var addRoutesForSetting = function addRoutesForSetting(app, filter) {
    app.get('/setting', filter, function (request, response) {
        return function _callee9() {
            var model;
            return _regenerator2.default.async(function _callee9$(_context9) {
                while (1) {
                    switch (_context9.prev = _context9.next) {
                        case 0:
                            _context9.next = 2;
                            return _regenerator2.default.awrap(_settingModel2.default.getSetting());

                        case 2:
                            model = _context9.sent;

                            (0, _handlers.successHandler)(response, model);

                        case 4:
                        case 'end':
                            return _context9.stop();
                    }
                }
            }, null, undefined);
        }().catch((0, _handlers.errorHandler)(response));
    });

    app.put('/setting', filter, function (request, response) {
        return function _callee10() {
            return _regenerator2.default.async(function _callee10$(_context10) {
                while (1) {
                    switch (_context10.prev = _context10.next) {
                        case 0:
                            _context10.next = 2;
                            return _regenerator2.default.awrap(_settingModel2.default.setSetting(request.body));

                        case 2:
                            (0, _handlers.successHandler)(response, {});

                        case 3:
                        case 'end':
                            return _context10.stop();
                    }
                }
            }, null, undefined);
        }().catch((0, _handlers.errorHandler)(response));
    });

    return app;
};
/*

const addRoutesForThemes = (app, filter) =>
{
    const themeDir = path.resolve(__dirname, '../public-app/static/bundle/themes');

    app.get(`/themes`, filter, (request, response) => co(function* ()
    {
        const fileNames = yield new Promise((res, rej) => fs.readdir(themeDir, (err, result) =>
        {
            if (err) return rej(err);
        res(result);
    }));

        const nameCounts = {};
        const regexBase = /^(.+)-base\.css$/;
        const regexPost = /^(.+)-post\.css$/;

        for (const fileName of fileNames)
        {
            if (regexBase.test(fileName))
            {
                const name = RegExp.$1;
                nameCounts[name] = Number.isInteger(nameCounts[name]) ? nameCounts[name] + 1 : 1;
            }
            else if (regexPost.test(fileName))
            {
                const name = RegExp.$1;
                nameCounts[name] = Number.isInteger(nameCounts[name]) ? nameCounts[name] + 1 : 1;
            }
        }

        const items = [];

        for (const name of Object.keys(nameCounts))
        {
            if (nameCounts[name] >= 2)
            {
                items.push({name});
            }
        }

        successHandler(response, {items});

    }).catch(errorHandler(response)));

    return app;
};
*/

var app = (0, _express2.default)();

app.use(_bodyParser2.default.json());
app.use(_bodyParser2.default.urlencoded({ extended: false }));
app.use((0, _cookieParser2.default)());
app.use((0, _expressSession2.default)({
    secret: _config2.default.getValue('sessionSecret'),
    resave: true,
    saveUninitialized: true
}));

app.use(_passportManager2.default.passport.initialize());
app.use(_passportManager2.default.passport.session());

// The order of those functions matters.
app = addRoutesForHome(app);
app = addRoutesForAuth(app, _handlers.isLoggedIn, _handlers.isLoggedOut, _passportManager2.default.localAuth);
app = addRoutesForUser(app, _handlers.isLoggedIn);
app = addRoutesForCrudOperations(_userModel2.default, app, _handlers.isLoggedIn);
app = addRoutesForCrudOperations(_categoryModel2.default, app, _handlers.isLoggedIn);
app = addRoutesForCrudOperations(_postModel2.default, app, _handlers.isLoggedIn);
app = addRoutesForSetting(app, _handlers.isLoggedIn);
//adminApiApp = addRoutesForThemes(adminApiApp, isLoggedIn);

exports.default = app;
module.exports = exports['default'];