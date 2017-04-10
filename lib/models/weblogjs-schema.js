'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.modifyDateData = exports.WeblogJsSchema = undefined;

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _simpleOdm = require('simple-odm');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var commonPaths = {

    created_date: {
        type: _simpleOdm.types.Date
    },

    updated_date: {
        type: _simpleOdm.types.Date
    }

};

var WeblogJsSchema = exports.WeblogJsSchema = function (_MongoSchema) {
    (0, _inherits3.default)(WeblogJsSchema, _MongoSchema);

    /**
     * @override
     */
    function WeblogJsSchema(arg) {
        (0, _classCallCheck3.default)(this, WeblogJsSchema);

        arg.paths = (0, _assign2.default)({}, arg.paths, commonPaths);
        return (0, _possibleConstructorReturn3.default)(this, (WeblogJsSchema.__proto__ || (0, _getPrototypeOf2.default)(WeblogJsSchema)).call(this, arg));
    }

    return WeblogJsSchema;
}(_simpleOdm.MongoSchema);

var modifyDateData = exports.modifyDateData = function modifyDateData(_ref) {
    var values = _ref.values;

    var _values = (0, _assign2.default)({}, values);

    if (!values._id) {
        _values.created_date = new Date();
        _values.updated_date = null;
    } else {
        _values.updated_date = new Date();
    }

    return { values: _values };
};