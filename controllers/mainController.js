const passport = require("passport");
const User = require("../models/user");

const Log = require("../models/logs");
let logList = [];

exports.getMainPage = (req, res) => {
  res.render("home");
};

exports.getRegisterPage = (req, res) => {
  res.render("register");
};

exports.postRegister = (req, res) => {
  User.register(
    { username: req.body.username },
    req.body.password,
    (error, user) => {
      if (error) {
        console.log(error);
        res.redirect("/register");
      } else {
        passport.authenticate("local")(req, res, () => {
          res.render("logs");
        });
      }
    }
  );
};

exports.getLoginPage = (req, res) => {
  res.render("login");
};

exports.postLogin = (req, res) => {
  const user = new User({
    username: req.body.username,
    passport: req.body.password,
  });

  req.login(user, (error) => {
    if (error) {
      console.log(error);
      res.redirect("/login");
    } else {
      passport.authenticate("local")(req, res, () => {
        res.redirect("/logs");
      });
    }
  });
};

exports.getLogsPage = (req, res) => {
  if (req.isAuthenticated()) {
    User.find({ userLog: { $ne: null } }, (error, usersFound) => {
      if (error) {
        console.log(error);
      } else {
        console.log(usersFound);
        var logTime = new Date().toUTCString();
        let newLog = new Log(logTime);
        newLog.saveLog();

        Log.fetchLogs((logs) => {
          console.log(logs);
          res.render("logs.ejs", { myLog: logs });
        });

      }
    });
  } else {
    res.redirect("/login");
  }
};

exports.userLogout = (req, res) => {
  req.logout();
  res.redirect("/");
};
