const { verify } = require("jsonwebtoken");
const stmodel = require("../models/student.model");
const route = require("express").Router();
const jwt = require("jsonwebtoken");

route.get("/", (req, res) => {
  stmodel
    .testConnect()
    .then((msg) => {
      res.send(msg);
    })
    .catch((err) => {
      res.send(err);
    });
});

route.post("/addstudent", (req, res) => {
  stmodel
    .postNewStudent(
      req.body.firstName,
      req.body.lastName,
      req.body.email,
      req.body.age,
      req.body.phone
    )
    .then((doc) => {
      res.status(200).json(doc);
    })
    .catch((err) => {
      res.status(200).json({ error: err });
    });
});

// verify middleware
verifyKey = (req, res, next) => {
  let privateKey = "this is secret kngfsjk6a456asdg";
  let key = req.headers.authorization;

  if (!key) {
    res.status(400).json({ msg: "access is rejectd!" });
  }
  try {
    jwt.verify(key, privateKey);
    next();
  } catch (e) {
    res.status(400).json({ msg: e });
  }
};

route.get("/students", verifyKey, (req, res) => {
  let key = req.headers.authorization;
  let user = jwt.decode(key);
  stmodel
    .getAllStudents()
    .then((doc) => {
      res.status(200).json({ students: doc, user: user });
    })
    .catch((err) => {
      console.log(err);
    });
});
route.get("/student/:id", verifyKey, (req, res) => {
  stmodel
    .getOnestudent(req.params.id)
    .then((doc) => {
      res.status(200).json(doc);
    })
    .catch((err) => {
      console.log(err);
    });
});

route.patch("/update/:id", verifyKey, (req, res) => {
  stmodel
    .updateStudent(
      req.params.id,
      req.body.firstName,
      req.body.lastName,
      req.body.email,
      req.body.age,
      req.body.phone
    )
    .then((doc) => {
      res.status(200).json(doc);
    })
    .catch((err) => {
      console.log(err);
    });
});

route.delete("/student/:id", verifyKey, (req, res) => {
  stmodel
    .deleteOnestudent(req.params.id)
    .then((doc) => {
      res.status(200).json(doc);
    })
    .catch((err) => {
      console.log(err);
    });
});

module.exports = route;
