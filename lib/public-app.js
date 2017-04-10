'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _isInteger = require('babel-runtime/core-js/number/is-integer');

var _isInteger2 = _interopRequireDefault(_isInteger);

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _statusCodes = require('./status-codes');

var _userModel = require('./models/user-model');

var _userModel2 = _interopRequireDefault(_userModel);

var _categoryModel = require('./models/category-model');

var _categoryModel2 = _interopRequireDefault(_categoryModel);

var _postModel = require('./models/post-model');

var _postModel2 = _interopRequireDefault(_postModel);

var _settingModel = require('./models/setting-model');

var _settingModel2 = _interopRequireDefault(_settingModel);

var _urlResolver = require('./utilities/url-resolver');

var _urlResolver2 = _interopRequireDefault(_urlResolver);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _cookieParser = require('cookie-parser');

var _cookieParser2 = _interopRequireDefault(_cookieParser);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//import Models from './models';
var parseParam = function parseParam(str, defaultValue) {
    var arr = str ? str.split('/') : [];
    return arr.length >= 3 && arr[2] ? arr[2] : defaultValue;
};

//const renderHtml = (element) =>
//    ("<!DOCTYPE html>" + ReactDOMServer.renderToStaticMarkup(element));

//const isProduction = process.env.NODE_ENV === "production";

/*
const errorHandler = (response) => co.wrap(function* (e)
{

    const setting = (yield SettingModel.getSetting()).values;

    response.type('html').status(ERROR).send(renderHtml(
        <Layout title="Error" blogName={setting.name} theme={setting.theme}>
            <Message message={isProduction ? "Error Occurred." : e.message}/>
        </Layout>
    ));
});
*/

var pageLinkBuilder = function pageLinkBuilder(_ref) {
    var page = _ref.page,
        author = _ref.author,
        category = _ref.category,
        tag = _ref.tag;

    if (!(0, _isInteger2.default)(page)) {
        return null;
    }

    var authorQuery = author ? 'author/' + author.slug : "";
    var categoryQuery = category ? 'category/' + category.slug : "";
    var tagQuery = tag ? 'tag/' + tag : "";
    var pageQuery = page > 1 ? 'page/' + page : "";

    return _urlResolver2.default.resolve(authorQuery, categoryQuery, tagQuery, pageQuery);
};

var getUsedCategories = function _callee() {
    var categorySums, categoryModels;
    return _regenerator2.default.async(function _callee$(_context) {
        while (1) {
            switch (_context.prev = _context.next) {
                case 0:
                    _context.next = 2;
                    return _regenerator2.default.awrap(_postModel2.default.aggregate([{
                        $match: {
                            category_id: { $ne: null },
                            published_date: { $lt: new Date() },
                            is_draft: { $ne: true }
                        }
                    }, {
                        $group: {
                            _id: "$category_id",
                            size: { $sum: 1 }
                        }
                    }]));

                case 2:
                    categorySums = _context.sent;
                    _context.next = 5;
                    return _regenerator2.default.awrap(_categoryModel2.default.findMany({
                        query: { _id: { $in: categorySums.map(function (obj) {
                                    return obj._id;
                                }) } }
                    }));

                case 5:
                    categoryModels = _context.sent;
                    return _context.abrupt('return', categoryModels.map(function (model) {
                        var values = model.values;
                        var sumObj = categorySums.find(function (obj) {
                            return obj._id.equals(values._id);
                        });
                        return (0, _assign2.default)({}, values, { size: sumObj.size });
                    }));

                case 7:
                case 'end':
                    return _context.stop();
            }
        }
    }, null, undefined);
};

var router = (0, _express.Router)();

router.get(/^(\/category\/[^/]+)?(\/author\/[^/]+)?(\/tag\/[^/]+)?(\/|\/page\/[0-9]+\/?)?$/, function _callee2(request, response) {
    var categorySlug, authorSlug, tag, page, _query, categoryModel, category, userModel, author, setting, postModels, sums, totalPages, sum, categoryName, tagName, authorName, prevPage, nextPage, categories, authors;

    return _regenerator2.default.async(function _callee2$(_context2) {
        while (1) {
            switch (_context2.prev = _context2.next) {
                case 0:
                    categorySlug = parseParam(request.params[0], null);
                    authorSlug = parseParam(request.params[1], null);
                    tag = parseParam(request.params[2], null);
                    page = parseParam(request.params[3], 1);
                    _query = {
                        published_date: { $lt: new Date() },
                        is_draft: { $ne: true }
                    };


                    if (tag) {
                        _query.tags = { $in: [tag] };
                    }

                    _context2.next = 8;
                    return _regenerator2.default.awrap(_categoryModel2.default.findOne({ slug: categorySlug }));

                case 8:
                    categoryModel = _context2.sent;
                    category = categoryModel ? categoryModel.values : null;


                    if (category) {
                        _query.category_id = category._id;
                    }

                    _context2.next = 13;
                    return _regenerator2.default.awrap(_userModel2.default.findOne({ slug: authorSlug }));

                case 13:
                    userModel = _context2.sent;
                    author = userModel ? userModel.values : null;


                    if (author) {
                        _query.author_id = author._id;
                    }

                    _context2.next = 18;
                    return _regenerator2.default.awrap(_settingModel2.default.getSetting());

                case 18:
                    setting = _context2.sent.values;
                    _context2.next = 21;
                    return _regenerator2.default.awrap(_postModel2.default.findMany({
                        query: _query,
                        sort: { published_date: -1, created_date: 1 },
                        skip: setting.posts_per_page * (page - 1),
                        limit: setting.posts_per_page
                    }));

                case 21:
                    postModels = _context2.sent;
                    _context2.next = 24;
                    return _regenerator2.default.awrap(_postModel2.default.aggregate([{
                        $match: _query
                    }, {
                        $group: {
                            _id: null,
                            size: { $sum: 1 }
                        }
                    }]));

                case 24:
                    sums = _context2.sent;
                    totalPages = 0;


                    if (sums.length > 0) {
                        sum = sums[0];

                        totalPages = Math.ceil(sum.size / setting.posts_per_page);
                    }

                    categoryName = category ? category.name + " - " : "";
                    tagName = tag ? tag + " - " : "";
                    authorName = author ? author.display_name + " - " : "";
                    prevPage = 1 <= page - 1 ? page - 1 : null;
                    nextPage = page + 1 <= totalPages ? page + 1 : null;
                    _context2.next = 34;
                    return _regenerator2.default.awrap(getUsedCategories());

                case 34:
                    categories = _context2.sent;
                    _context2.next = 37;
                    return _regenerator2.default.awrap(_userModel2.default.findMany());

                case 37:
                    _context2.t0 = function (m) {
                        return m.values;
                    };

                    authors = _context2.sent.map(_context2.t0);

                    /*
                    const menu = categories.length > 0 ?
                    <
                    CategoryList
                    categories = {categories} / >
                    :
                    null;
                    */

                    /*
                    response.type('html').status(OK).send(renderHtml(
                        < Layout
                    title = {`${authorName}${categoryName}${tagName}${setting.name}`
                    }
                    blogName = {setting.name
                    }
                    theme = {setting.theme
                    }
                    menu = {menu} >
                        < Posts
                    posts = {postModels.map(m => m.values)
                    }
                    categories = {categories}
                    authors = {authors}
                        / >
                        < Pagination
                    prevPageLink = {pageLinkBuilder({page: prevPage, category, author, tag})}
                    nextPageLink = {pageLinkBuilder({page: nextPage, category, author, tag})}
                        / >
                        < / Layout >
                    ))
                    ;
                      response.type('html').status(OK).send("test");
                    */

                    response.type('json').status(_statusCodes.OK).send({});

                case 40:
                case 'end':
                    return _context2.stop();
            }
        }
    }, null, undefined);
});

/*
router.get(/^\/post\/([^/]+)\/?$/, (request, response, next) => co(function* ()
{
    const postSlug = request.params[0];

    const PostModel = Models.getModel('post');

    const post = await PostModel.findOne({
        slug: postSlug,
        published_date: {$lt: new Date()},
        is_draft: {$ne: true}
    });

    if (!post)
    {
        return next();
    }

    const setting = (await SettingModel.getSetting()).values;
    const values = post.values;
    const categories = await getUsedCategories();
    const authors = (await UserModel.findMany()).map(m => m.values);
    const menu = categories.length > 0 ?
    <
    CategoryList
    categories = {categories} / >
    :
    null;

    response.type('html').status(OK).send(renderHtml(
        < Layout
    title = {`${values.title} - ${setting.name}`
}
    blogName = {setting.name
}
    theme = {setting.theme
}
    menu = {menu}
        >
        < Posts
    posts = {[values]}
    categories = {categories}
    authors = {authors} / >
        < / Layout >
    ))
    ;

}).catch(errorHandler(response)));

router.get("*", (request, response) => co(function* ()
{
    const setting = (await SettingModel.getSetting()).values;

    response.type('html').status(NOT_FOUND).send(renderHtml(
        < Layout
    title = "Not Found"
    blogName = {setting.name
}
    theme = {setting.theme
}>
    <
    Message
    message = "The page you are looking for is not found." / >
        < / Layout >
    ))
    ;
}).catch(errorHandler(response)));
*/

var app = (0, _express2.default)();

app.use(_bodyParser2.default.json());
app.use(_bodyParser2.default.urlencoded({ extended: false }));
app.use((0, _cookieParser2.default)());
/*
app.use(expressSession({
    secret: config.getValue('sessionSecret'),
    resave: true,
    saveUninitialized: true
}));

app.use(PassportManager.passport.initialize());
app.use(PassportManager.passport.session());
*/

// The order of those functions matters.
/*
app = addRoutesForHome(app);
app = addRoutesForAuth(app, isLoggedIn, isLoggedOut, PassportManager.localAuth);
app = addRoutesForUser(app, isLoggedIn);
app = addRoutesForCrudOperations(UserModel, app, isLoggedIn);
app = addRoutesForCrudOperations(CategoryModel, app, isLoggedIn);
app = addRoutesForCrudOperations(PostModel, app, isLoggedIn);
app = addRoutesForSetting(app, isLoggedIn);
*/
app.use(router);

exports.default = app;
module.exports = exports['default'];