'use strict';

var _simpleOdm = require('simple-odm');

var _config = require('../config');

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_simpleOdm.mongoDriver.setUp({
    host: _config2.default.getValue('dbHost'),
    port: _config2.default.getValue('dbPort'),
    database: _config2.default.getValue('dbName')
});