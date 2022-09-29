const port = 2200;
const router = require("./routers/student.router");
const userRoute = require("./routers/user.route");
const express = require("express");
const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use("/", router);
app.use("/", userRoute);

const server = app.listen(port, () => {
  console.log(`server works on ${port}`);
});
