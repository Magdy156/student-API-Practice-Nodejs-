const e = require("express");
const mongoose = require("mongoose");
const joi = require("joi");

let joiSchema = joi.object({
  firstName: joi.string().alphanum().min(2).max(20).required(),
  lastName: joi.string().alphanum().min(2).max(20).required(),
  email: joi
    .string()
    .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } }).required,
  age: joi.number().required(),
  phone: joi.number().required(),
});

let studentSchema = mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  age: Number,
  phone: Number,
});

let student = mongoose.model("student", studentSchema);
const url = "mongodb://localhost:27017/University";

exports.testConnect = () => {
  return new Promise((resolve, reject) => {
    mongoose
      .connect(url)
      .then(() => {
        mongoose.disconnect();
        resolve("connected!");
      })
      .catch((err) => {
        reject(err);
      });
  });
};

exports.postNewStudent = (fname, lname, email, age, phone) => {
  return new Promise((resolve, reject) => {
    mongoose
      .connect(url)
      .then(() => {
        let validation = joiSchema.validate({
          firstName: fname,
          lastName: lname,
          email: email,
          age: age,
          phone: phone,
        });
        if (validation.error) {
          reject(validation.error.details[0].message);
        }

        let stu = new student({
          firstName: fname,
          lastName: lname,
          email: email,
          age: age,
          phone: phone,
        });
        stu
          .save()
          .then((doc) => {
            mongoose.disconnect();
            resolve(doc);
          })
          .catch((err) => {
            mongoose.disconnect();
            reject(err);
          });
      })
      .catch((err) => {
        reject(err);
      });
  });
};
exports.getAllStudents = () => {
  return new Promise((resolve, reject) => {
    mongoose
      .connect(url)
      .then(() => {
        return student.find();
      })
      .then((doc) => {
        resolve(doc);
      })
      .catch((err) => {
        reject(err);
      });
  });
};
exports.getOnestudent = (id) => {
  return new Promise((resolve, reject) => {
    mongoose
      .connect(url)
      .then(() => {
        return student.findById(id);
      })
      .then((doc) => {
        resolve(doc);
      })
      .catch((err) => {
        reject(err);
      });
  });
};
exports.updateStudent = (id, fname, lname, email, age, phone) => {
  return new Promise((resolve, reject) => {
    mongoose
      .connect(url)
      .then(() => {
        let validation = joiSchema.validate({
          firstName: fname,
          lastName: lname,
          email: email,
          age: age,
          phone: phone,
        });
        if (validation.error) {
          reject(validation.error.details[0].message);
        }
        return student.updateOne(
          { _id: id },
          {
            firstName: fname,
            lastName: lname,
            email: email,
            age: age,
            phone: phone,
          }
        );
      })
      .then((doc) => {
        resolve(doc);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

exports.deleteOnestudent = (id) => {
  return new Promise((resolve, reject) => {
    mongoose
      .connect(url)
      .then(() => {
        return student.deleteOne({ _id: id });
      })
      .then((doc) => {
        resolve(doc);
      })
      .catch((err) => {
        reject(err);
      });
  });
};
