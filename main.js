//################initialize express app#######
const express = require('express');
const app = express();
//########global middelware#########
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const cors = require("cors");
app.use(cors());
app.use(express.static("upload"));
//##########require modules#########
const user = require("./routes/user.js");  
app.use("", user.userRouter);
const admin_manage_user = require("./middleware/admin_manage_user.js");
app.use("", admin_manage_user);
const admin_manage_job = require("./middleware/admin_manage_job.js");
app.use("", admin_manage_job);
const job = require("./routes/job.js");
app.use("", job.router);
const person=require("./middleware/person.js");
app.use("",person.router);
///////////to run app/////////////
app.listen(4000, "localhost", () => {

    console.log("server is running");
});