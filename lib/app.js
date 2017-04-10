'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.stop = exports.start = exports.init = undefined;

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var server = void 0;

var init = exports.init = function init(values) {
    var config = require('./config');
    config.setValues(values);
};

var start = exports.start = function _callee() {
    var config, adminApiApp, publicSiteApp, UserModel, app, admin, promise;
    return _regenerator2.default.async(function _callee$(_context) {
        while (1) {
            switch (_context.prev = _context.next) {
                case 0:
                    config = require('./config');
                    adminApiApp = require('./admin-app');
                    publicSiteApp = require('./public-app');
                    UserModel = require('./models/user-model');
                    app = (0, _express2.default)();


                    app.use(config.getValue('adminApiRoot'), adminApiApp);
                    app.use(config.getValue('publicApiRoot'), publicSiteApp);

                    // Create an admin user if it doesn't exist.

                    _context.next = 9;
                    return _regenerator2.default.awrap(UserModel.findOne({
                        email: config.getValue('adminEmail')
                    }));

                case 9:
                    admin = _context.sent;
                    _context.prev = 10;

                    if (admin) {
                        _context.next = 14;
                        break;
                    }

                    _context.next = 14;
                    return _regenerator2.default.awrap(new UserModel({
                        email: config.getValue('adminEmail'),
                        password: config.getValue('adminPassword'),
                        display_name: config.getValue('adminDisplayName'),
                        slug: config.getValue('adminSlug')
                    }).save());

                case 14:
                    _context.next = 21;
                    break;

                case 16:
                    _context.prev = 16;
                    _context.t0 = _context['catch'](10);

                    console.error(_context.t0.message);
                    console.error('WeblogJS failed to start up.');
                    return _context.abrupt('return');

                case 21:

                    // Start a web server

                    promise = new _promise2.default(function (resolve, reject) {
                        server = app.listen(config.getValue('webPort'), config.getValue('webHost'), function (e) {
                            if (e) return reject(e);
                            resolve();
                        });
                    });


                    console.log("WeblogJS has started.");
                    console.log('Public API: http://' + config.getValue('webHost') + ':' + config.getValue('webPort') + config.getValue('publicApiRoot'));
                    console.log('Admin API: http://' + config.getValue('webHost') + ':' + config.getValue('webPort') + config.getValue('adminApiRoot'));

                    _context.next = 27;
                    return _regenerator2.default.awrap(promise);

                case 27:
                    return _context.abrupt('return', _context.sent);

                case 28:
                case 'end':
                    return _context.stop();
            }
        }
    }, null, undefined, [[10, 16]]);
};

var stop = exports.stop = function _callee2() {
    return _regenerator2.default.async(function _callee2$(_context2) {
        while (1) {
            switch (_context2.prev = _context2.next) {
                case 0:
                    if (!server) {
                        _context2.next = 4;
                        break;
                    }

                    console.log("WeblogJS has stopped.");
                    _context2.next = 4;
                    return _regenerator2.default.awrap(server.close());

                case 4:
                case 'end':
                    return _context2.stop();
            }
        }
    }, null, undefined);
};