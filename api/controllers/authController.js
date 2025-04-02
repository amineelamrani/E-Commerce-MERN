const User = require("./../models/userModel");
const catchAsync = require("./../utils/catchAsync");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { transporter } = require("./../utils/email");

exports.protect = catchAsync(async (req, res, next) => {
  const token = req.cookies.ecomApp;
  const id = jwt.verify(token, process.env.SECRET_JWT_KEY).id;
  const checkUser = await User.findById(id);

  if (!checkUser || !checkUser.isValid) {
    return res.status(404).json({
      status: "fail",
      message: "You are not allowed! for Auth users only",
    });
  }

  req.userId = id;
  next();
});

exports.adminRestricted = catchAsync(async (req, res, next) => {
  const token = req.cookies.ecomApp;
  const id = jwt.verify(token, process.env.SECRET_JWT_KEY).id;
  const checkAdmin = await User.findById(id);
  if (!checkAdmin || !checkAdmin.admin) {
    return res.status(400).json({
      status: "fail",
      message: "You are not allowed! for admin only!!",
    });
  }

  if (checkAdmin.admin) {
    req.userIdAdm = id;
    next();
  }
});

exports.checkAdminRight = (req, res) => {
  if (req.userIdAdm) {
    return res.status(200).json({
      status: "success",
      message: "Admin Right granted",
    });
  } else {
    return res.status(400).json({
      status: "fail",
      message: "Not allowed to access! for admin only",
    });
  }
};

exports.signup = catchAsync(async (req, res, next) => {
  // /!\ Need to send an email to the person in order to confirm the email adress of the user
  const { name, email, password, confirmPassword } = req.body;
  // new user write the credentials
  // we generate a random unique String and attaached to the new document created
  const uniqueString = generateRandomString();
  const newUser = await User.create({
    name,
    email,
    password,
    confirmPassword,
    uniqueString,
  });
  newUser.password = undefined;
  // we send an email to the provided mail adress containing the adress /verify?uniqueString:uniqueString&id:idXXX
  sendMailConfirmation(email, name, uniqueString);

  return res.status(201).json({
    status: "success",
    result: {
      message: "unconfirmed",
      action: "Check your email to confirm your account",
    },
  });
});

exports.signin = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({
      status: "fail",
      message: "Please provide email and password",
    });
  }
  const user = await User.findOne({ email });
  if (!user || !user.isValid) {
    return res
      .status(400)
      .json({ status: "fail", message: "User Not Found or not confirmed" });
  }
  const validPassword = bcrypt.compareSync(password, user.password);
  if (!validPassword) {
    return res
      .status(400)
      .json({ status: "fail", message: "email or password is invalid" });
  }
  user.password = undefined;

  return res
    .status(200)
    .cookie("ecomApp", signToken(user._id), {
      httpOnly: true,
      expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    })
    .json({
      status: "success",
      result: user,
    });
});

exports.oAuth = catchAsync(async (req, res, next) => {
  // the majority of the work for the OAuth is made through the firebase SDK provided by google on the client side
  const { name, email } = req.body;
  const validUser = await User.findOne({ email });
  if (validUser) {
    // if the user auth via Oauth is in the database
    return res
      .status(202)
      .cookie("ecomApp", signToken(validUser._id), {
        httpOnly: true,
        expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      })
      .json({
        status: "success",
        result: validUser,
      });
  } else {
    // if the user does not exist => We need to create an account for him
    const password = generateRandomPassword(); //generate a random password
    const confirmPassword = password;
    const newUser = await User.create({
      name,
      email,
      password,
      confirmPassword,
      isValid: true,
    });
    return res
      .status(202)
      .cookie("ecomApp", signToken(newUser._id), {
        httpOnly: true,
        expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      })
      .json({
        status: "success",
        result: newUser,
      });
  }
});

exports.signOut = (req, res) => {
  res.cookie("ecomApp", "loggedout", {
    expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    httpOnly: true,
  });
  res
    .status(200)
    .json({ status: "success", message: "logged Out successfully!" });
};

exports.verifyAccount = catchAsync(async (req, res, next) => {
  // once we got a got that id and uniqueString from params (we check if the uniqueString is the same as we have in the database => If yes we make isValid to true)
  // we return a confirmed status and we send the client to the sign in page we send the token ...
  const { uniqueString, mail } = req.query;
  const unConfirmedUser = await User.findOne({ email: mail });
  if (!unConfirmedUser) {
    return res.status(404).json({
      status: "fail",
      message: "User not found!",
    });
  }
  //check if the account is already confirmed
  if (unConfirmedUser.isValid)
    return res
      .status(400)
      .json({ status: "fail", message: "Account already verified" });

  // if the user exist alread
  // the make isValid to true : account verified
  if (uniqueString !== unConfirmedUser.uniqueString) {
    return res.status(404).json({
      status: "fail",
      message: "Wrong code provided! please check the inbox code sent to you",
    });
  }
  unConfirmedUser.isValid = true;
  unConfirmedUser.confirmPassword = unConfirmedUser.password;
  await unConfirmedUser.save();
  res
    .status(202)
    .cookie("ecomApp", signToken(unConfirmedUser._id), {
      httpOnly: true,
      expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    })
    .json({
      status: "success",
      message: "confirmed",
      result: {
        name: unConfirmedUser.name,
        email: unConfirmedUser.email,
      },
    });
});

exports.forgetPassword = catchAsync(async (req, res, next) => {
  // check if the user exist
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return res
      .status(400)
      .json({ status: "fail", message: "User Not Found or not confirmed" });
  }
  // generate a random String 25
  const resetToken = generateRandomResetToken();
  // crypt it -> Store it in  token
  // token will be the content of passwordResetToken + set passwordResetExpires to now + 1hour
  user.passwordResetToken = signToken(resetToken);
  user.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  user.confirmPassword = user.password;
  await user.save();

  // Send an email containing resetPassword/:token (the token not crypted and not hashed);
  sendResetMail(req.body.email, resetToken);
  res.status(200).json({
    status: "success",
    message: "Token sent to email!",
  });
});

// Reset need some raffinement not like that the logic is fucked up here
// what to do instead => send the token in the mail only / when we do the thing we have to send the mail & token from the front end in params && password in the req.body in the POST request
exports.resetPassword = catchAsync(async (req, res, next) => {
  // /!\ For the reset endpoint from the front end we have to send email(no need to make the user rewrite it again) and token(parsed manually) in the params && password on the req.body from an imput for example

  // got the token
  const { email, token } = req.params;
  // find the user
  const user = await User.findOne({ email });
  // verify if the resetoken stored is the same as the one in the url
  if (
    jwt.verify(user.passwordResetToken, process.env.SECRET_JWT_KEY).id === token
  ) {
    // if yes check if the now is less than the expires date
    if (user.passwordResetExpires > Date.now()) {
      // if this is valid -> Change the password
      user.password = req.body.password;
      user.confirmPassword = req.body.confirmPassword;
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      await user.save();

      return res
        .status(200)
        .cookie("ecomApp", signToken(user._id), {
          httpOnly: true,
          expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        })
        .json({
          status: "success",
          result: user,
        });
    } else {
      return res.status(404).json({
        status: "fail",
        message: "Reset token is expired",
      });
    }
  }

  res.status(400).json({
    status: "fail",
    message: "You can not allowed to reset the password",
  });
  // hash it using the same method

  // if yes create the new password & confirmation password & save the new password & send the cookie that contain token loging
});

exports.deleteAccount = catchAsync(async (req, res, next) => {
  await User.findByIdAndDelete(req.userId);
  return res
    .status(200)
    .cookie("ecomApp", "deleted", {
      expires: new Date(Date.now() + 3 * 1000),
      httpOnly: true,
    })
    .json({
      status: "success",
      message: "Account deleted successfully",
    });
});

// Functions
const signToken = (id) => {
  return jwt.sign({ id: id }, process.env.SECRET_JWT_KEY);
};

const generateRandomPassword = () => {
  const charset =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let password = "";
  for (let i = 0; i < 12; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    password += charset[randomIndex];
  }
  return password;
};

const generateRandomString = () => {
  const charset =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let password = "";
  for (let i = 0; i < 12; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    password += charset[randomIndex];
  }
  return password;
};

const generateRandomResetToken = () => {
  const charset =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let password = "";
  for (let i = 0; i < 25; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    password += charset[randomIndex];
  }
  return password;
};

const sendMailConfirmation = async (newUserMail, newUserName, uniqueString) => {
  const info = await transporter.sendMail({
    from: `${process.env.NODE_MAIL}`,
    to: newUserMail, // list of receivers
    subject: `Welcome ${newUserName}! (Email Adress Confirmation)`, // Subject line
    text: `unique String ${uniqueString}`, // plain text body
    html: `<h1>Welcome ${newUserName}</h1>
        <p>Please visit this link to confirm your account.<br/>Do not share this Link with anyone</p>
        <p>Your Unique String : </p>
        <p><samp>${uniqueString}</samp></p>
      `,
    // html: "<b>Hello world?</b>", // html body
  });
};

const sendResetMail = async (email, resetToken) => {
  const info = await transporter.sendMail({
    from: `${process.env.NODE_MAIL}`,
    to: email, // list of receivers
    subject: `Resetting Password `, // Subject line
    html: `<h1>Hello!</h1>
        <p>Please visit this link to reset your password.<br/>It is valid for only 1hour! Do not share this Link with anyone!!</p>
        <p>Here is your reset Token </br>${resetToken}</p>
        
      `,
  });
};
