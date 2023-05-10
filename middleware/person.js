const conn= require("../db/connection.js");
const util = require("util"); // helper
const { uuid } = require('uuidv4');
const router = require("express").Router();
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const { body, validationResult } = require("express-validator");
const { table } = require("console");
const autharized = require("../authontication/author");
const Get = require("../modules/get.js");
userTable="user";
class Person{
 email=''
 password=''
    get_email=async (req, res) => {
    const user = await Get.get( req.params.id,userTable)
    if (!user[0]) {
     return  res.status(404).json({ ms: "user not found !" });
    }
    return res.status(200).json(user[0].email);
   };

    get_password=async (req, res) => {
    const user = await Get.get( req.params.id,userTable)
    if (!user[0]) {
      return res.status(404).json({ ms: "user not found !" });
    }
     return res.status(200).json(user[0].password);
   };
   //LOG IN
 login=async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const query = util.promisify(conn.query).bind(conn); 
      const user = await query("select * from user where email = ?",[req.body.email]);
      if (user.length == 0) {
        return res.status(404).json({
          errors: [{msg: "email not found"}]
        });
      }else{
        const checkPassword =  bcrypt.compare(req.body.password,user[0].password);
        if (checkPassword) {
          //  delete user[0].password;
          return res.status(200).json({user:user[0]});
        } else {
          return res.status(404).json({
            errors: [ {msg: "password is wrong !",m:user[0] }, ],
          });
        }
      }

    } catch (err) {
     return  res.status(500).json({ err: err });
    }
  };
  //####list jobs
get_jobs =async (req, res) => {
  const query = util.promisify(conn.query).bind(conn);
  let search = "";
  if (req.query.search) {
    search = `where position LIKE '%${req.query.search}%' or description LIKE '%${req.query.search}%'`;
  }
  const jobs = await query(`select * from job ${search}`);
  jobs.map((job) => {
    job.image_url = "http://" + req.hostname + ":4000/" + job.image_url;
  });
  return res.status(200).json(jobs);
};
}
const personObj=new Person();
router.get("/get-email/:id", personObj.get_email);
router.get("/get-password/:id",personObj.get_password);
router.post("/login",
  body("email").isEmail().withMessage("please enter a valid email!"),    
  body("password").isLength({ min: 8, max: 10 }).withMessage("password should be between (8-10) character"),personObj.login)
router.get('/get-jobs', autharized,personObj.get_jobs)
  module.exports.Person=Person
  module.exports.router=router
 