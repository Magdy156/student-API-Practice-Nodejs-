const e = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

let userSchema = mongoose.Schema({
  userName: String,
  email: String,
  password: String,
});

let User = mongoose.model("user", userSchema);
const url = "mongodb://localhost:27017/University";

exports.register = (userName, email, password) => {
  return new Promise((resolve, reject) => {
    mongoose
      .connect(url)
      .then(() => {
        return User.findOne({ email: email });
      })
      .then((doc) => {
        if (doc) {
          mongoose.disconnect();
          reject("Email exists");
        } else {
          bcrypt.hash(password, 10).then((hashedPass) => {
            let user = new User({
              userName: userName,
              email: email,
              password: hashedPass,
            });
            user
              .save()
              .then((user) => {
                mongoose.disconnect();
                resolve(user);
              })
              .catch((err) => {
                mongoose.disconnect();
                reject(err);
              });
          });
        }
      });
  });
};
let privateKey = "this is secret kngfsjk6a456asdg";
exports.login = (email, password) => {
  return new Promise((resolve, reject) => {
    mongoose
      .connect(url)
      .then(() => {
        return User.findOne({ email: email });
      })
      .then((user) => {
        if (!user) {
          mongoose.disconnect();
          reject("you are not registered");
        } else {
          bcrypt
            .compare(password, user.password)
            .then((samePass) => {
              if (samePass) {
                let token = jwt.sign(
                  { id: user._id, userName: user.userName },
                  privateKey,
                  {
                    expiresIn: "1d",
                  }
                );
                resolve(token);
              } else {
                mongoose.disconnect();
                reject("wrong password");
              }
            })
            .catch((err) => {
              mongoose.disconnect();
              reject(err);
            });
        }
      });
  });
};
