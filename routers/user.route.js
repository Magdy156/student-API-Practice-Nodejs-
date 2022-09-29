const route = require("express").Router();
const userModel = require("../models/user.model");

route.post("/register", (req, res) => {
  userModel
    .register(req.body.userName, req.body.email, req.body.password)
    .then((user) => {
      res.status(200).json({ user: user, msg: "added" });
    })
    .catch((err) => {
      res.status(400).json({ error: err });
    });
});
route.post("/login", (req, res) => {
  userModel
    .login(req.body.email, req.body.password)
    .then((token) => {
      res.status(200).json({ token: token });
    })
    .catch((err) => {
      res.status(400).json({ error: err });
    });
});

module.exports = route;
