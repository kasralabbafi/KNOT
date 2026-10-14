const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");

const crypto = require("crypto");

const User = require("../models/User.model");
const Token = require("../models/Token.model");

const isValid = require("../utils/dateCompare");

exports.checkUserExistance = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      res.status(200).json({
        userExistance: 1,
      });
    } else {
      res.status(200).json({
        userExistance: 0,
      });
    }
  } catch (error) {
    error.message = "Internal server error"
    next(error);
  }
};

exports.signup = async (req, res) => {
  try {
    const validation = await User.validate(req.body);
    await User.create({
      ...req.body,
      password: await bcrypt.hash(req.body.password, 10),
      confirmPassword: "",
      seqAnswers: await Promise.all(
        req.body.seqAnswers.map((e) => {
          return bcrypt.hash(e, 10);
        }),
      ),
    });
    res.status(201).json({
      message: "User created",
    });
  } catch (error) {
    if(error.name == "ValidationError") {
      error.statusCode = 422
      error.messages = error.inner.map(e => {
        return {message: e.message, field: e.path}
      })
    } else {
      error.statusCode = 500
      error.message = "Internal server error"
    }
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const user = await User.findOne({
      email: req.body.email,
    });
    const passwordMatch = await bcrypt.compare(req.body.password, user.password);
    if (passwordMatch) {
      const accessToken = jwt.sign(
        {
          id: user.id,
          userName: user.userName,
          fullName: user.fullName,
          email: user.email,
        },
        process.env.JWT_ACCESS_SECRET,
        { expiresIn: "1h" },
      );
      const refreshToken = crypto.randomBytes(64).toString("hex");
      await Token.create({
        tokenHash: await bcrypt.hash(refreshToken, 10),
        userId: user.id,
        familyId: uuidv4(),
      });
      return res.json({ accessToken }).cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
        path: "/auth/refreshtoken",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
    } else {
      res.status(401).json({
        message: "Email or password is incorrect",
      });
    }
  } catch (error) {
    error.statusCode = 500
    error.message = "Internal server error"
    next(error);
  }
};

exports.newAccessToken = async (req, res, next) => {
  try {
    const {refreshToken, userId} = await Token.findOne({
      tokenHash: await bcrypt.hash(req.cookies.refreshToken),
    });

    const user = await User.findOne({
      id: userId
    })
    if (
      refreshToken &&
      ! refreshToken.revokedAt &&
      isValid(refreshToken.expiresAt)
    ) {
      
      const accessToken = jwt.sign(
        {
          id: user.id,
          userName: user.userName,
          fullName: user.fullName,
          email: user.email,
        },
        proccess.env.JWT_ACCESS_SECRET,
        { expiresIn: "1h" },
      );
      const refreshToken = crypto.randomBytes(64).toString("hex");
      await Token.create({
        tokenHash: await bcrypt.hash(refreshToken, 10),
        userId: user.id,
        familyId: uuidv4(),
      });
      return res.json({ accessToken }).cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
        path: "/auth/refreshtoken",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
    } else {
      res.json({message: "Refresh token is invalid"})
    }
  } catch (error) {
    error.statusCode = 500
    error.message =  "Internal server error"
    next(error);
  }
};

exports.logout = async (req, res, next) => {
  try {
    const tokenHash = bcrypt.hash(req.cookies.refreshToken, 10);
    await Token.findOneAndUpdate(
      { tokenHash },
      { revokedAt: new Date() },
    );
    return res.status(204).clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      path: "/",
    });
  } catch (error) {
    error.statusCode = 500
    next(error);
  }
};