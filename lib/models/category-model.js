'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _simpleOdm = require('simple-odm');

var _categorySchema = require('./category-schema');

var _categorySchema2 = _interopRequireDefault(_categorySchema);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

require('./setup-db-connection');

var CategoryModel = function (_MongoModel) {
    (0, _inherits3.default)(CategoryModel, _MongoModel);

    function CategoryModel() {
        (0, _classCallCheck3.default)(this, CategoryModel);
        return (0, _possibleConstructorReturn3.default)(this, (CategoryModel.__proto__ || (0, _getPrototypeOf2.default)(CategoryModel)).apply(this, arguments));
    }

    (0, _createClass3.default)(CategoryModel, null, [{
        key: 'name',
        get: function get() {
            return _categorySchema2.default.name;
        }
    }, {
        key: 'schema',
        get: function get() {
            return _categorySchema2.default;
        }
    }]);
    return CategoryModel;
}(_simpleOdm.MongoModel);

exports.default = CategoryModel;
module.exports = exports['default'];