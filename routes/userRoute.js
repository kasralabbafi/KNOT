const { Router } = require("express");

const userController = require("../controllers/user.controller");
const authenticate = require("../middlewares/authenticate");

const router = new Router();

exports.login = ("/login", userController.login);

exports.logout = ("/logout", authenticate, userController.logout);

exports.signup = ("/register", userController.signup);

exports.checkUserExistance = ("/checkuser", userController.checkUserExistance);

exports.newAccessToken = ("/newaccesstoken", userController.newAccessToken);

module.exports = router;
