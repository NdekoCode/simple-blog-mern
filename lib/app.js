"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _express = _interopRequireDefault(require("express"));
var _constants = require("./libs/constants.js");
var _postsRoutes = _interopRequireDefault(require("./routes/posts.routes.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
var app = (0, _express["default"])();
app.use(_express["default"].json());
app.use(_express["default"].urlencoded({
  extended: false
}));
app.use(_constants.BASE_API + "/posts", _postsRoutes["default"]);
var _default = app;
exports["default"] = _default;