const express = require("express");
const jwt = require("jsonwebtoken");
const userRouter = express.Router();
const passport = require("../passport");
const userController = require("../controller/userController");

const verifyUser = passport.authenticate("jwt", { session: false });

function checkTokenExpiry(req, res, next) {
  const token = req.cookies.jwtToken;

  if (!token) {
    return res
      .status(403)
      .json({ message: "Access denied. No token provided." });
  }

  jwt.verify(token, process.env.ACCESS_SECRET, async (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Token is invalid or expired." });
    }

    req.user = decoded;
    next();
  });
}

function checkRefreshTokenExpiry(req, res, next) {
  const token = req.cookies.refreshToken;

  if (!token) {
    return res
      .status(403)
      .json({ message: "Access denied. No refresh token provided." });
  }

  jwt.verify(token, process.env.REFRESH_SECRET, async (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Refresh token is invalid or expired." });
    }

    req.user = decoded;

    next();
  });
}

userRouter.post("/signup", userController.signup);
userRouter.post("/login", userController.login);
userRouter.get("/logout", verifyUser, userController.logout)
userRouter.get("/protected", verifyUser, checkTokenExpiry, userController.protected);
userRouter.post("/refresh-token", checkRefreshTokenExpiry, userController.refreshToken);
userRouter.put("/profile", verifyUser, checkTokenExpiry, userController.editUser);
userRouter.delete("/profile", verifyUser, checkTokenExpiry, userController.deleteUser);

module.exports = userRouter;
