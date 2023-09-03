const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const passport = require("../passport");
const User = require("../model/user");
//REMEMBER TO ADD THE SECURE TRUE PROPERTY TO THE COOKIE WHEN DEPLOYING

exports.signup = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Username and password are required." });
  }

  try {
    const user = await User.findOne({ email });

    if (user) {
      return res
        .status(401)
        .json({ message: "A user with the given email exists" });
    } else {
      const user = await User.create({
        email,
        password,
      });

      const token = jwt.sign({ _id: user._id }, process.env.ACCESS_SECRET, {
        expiresIn: "1h",
      });
      res.cookie("jwtToken", token, { httpOnly: true });

      const refreshToken = jwt.sign(
        { _id: user._id },
        process.env.REFRESH_SECRET,
        { expiresIn: "30d" }
      );
      res.cookie("refreshToken", refreshToken, { httpOnly: true });

      return res
        .status(201)
        .json({ message: "User registered successfully!.", token });
    }
  } catch (err) {
    return res.status(500).json({ err: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    passport.authenticate("local", { session: false }, (err, user) => {
      if (err) {
        return res.status(401).json({ err: err.message });
      }

      if (!user) {
        return res.status(401).json({ message: "Account does not exist" });
      }
      
      req.login(user, { session: false }, async (err) => {
        if (err) return res.status(500).json({ message: "Login Failed" });

        const token = jwt.sign({ _id: user._id }, process.env.ACCESS_SECRET, {
          expiresIn: "1h",
        });
        res.cookie("jwtToken", token, { httpOnly: true });
        //ADD THIS WHEN IN PRODUCTION
        //res.cookie("jwtToken", token, { httpOnly: true, secure: true });

        //VERIFY WHETHER YOU SHOULD GIVE A USER A NEW REFRESH TOKEN ON LOGIN///////////////////////
        const refreshToken = jwt.sign(
          { _id: user._id },
          process.env.REFRESH_SECRET,
          { expiresIn: "30d" }
        );
        res.cookie("refreshToken", refreshToken, { httpOnly: true });

        return res.json({
          message: "You are successfully logged in!",
          token: token,
        });
      });
    })(req, res);
  } catch (err) {
    return res.status(500).json({ err: err.message });
  }
};

exports.protected = async (req, res) => {
  const user = await User.findById(req.user._id);
  return res.json({user, message: "Protected route" });
};

exports.logout = async (req, res) => {
  try {
    res.clearCookie("jwtToken");
    res.clearCookie("refreshToken"); 
    res.status(200).json({ message: "Logout successful" });
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
};

exports.refreshToken = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return res.status(401).json({ message: "Refresh token not provided." });
  }

  try {
    const decodedUser = jwt.verify(refreshToken, process.env.REFRESH_SECRET);

    // Check if the decoded token is valid and not expired
    if (!decodedUser || decodedUser.exp * 1000 < Date.now()) {
      return res
        .status(401)
        .json({ message: "Refresh token is invalid or expired." });
    }

    const newAccessToken = jwt.sign(
      { _id: decodedUser._id },
      process.env.ACCESS_SECRET,
      { expiresIn: "1h" }
    );
    res.cookie("jwtToken", newAccessToken, { httpOnly: true });

    return res.status(200).json({
      message: "New access token generated successfully.",
      token: newAccessToken,
    });
  } catch (err) {
    return res.status(500).json({ err: err.message });
  }
};


exports.editUser = async (req, res) => {
  const userId = req.user._id;

  const updatedUserData = req.body;

  User.findByIdAndUpdate(userId, updatedUserData, {new: true})
  .then(updatedUser => {
    console.log(updatedUser);
  })
  .catch(err => {
    console.log(err);
  })
  return res.status(200).json({message: "user updated successfully"})
}

exports.deleteUser = async (req, res) => {
  try {
    //Find and delete a user by its given ID
    const user = await User.findByIdAndDelete(req.user._id);
    if (!user) {
      return res.status(404).json({message: "user not found"});
    }
    return res.status(200).json({message: "User deleted"});

  } catch (error) {
    return res.status(500).json({ error: err.message });
  }
};