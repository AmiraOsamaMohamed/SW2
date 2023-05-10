const conn = require("../db/connection.js");
const { uuid } = require('uuidv4');
const fs = require('fs');
const util = require("util"); // helper
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const Get = require("../modules/get.js");
const Insert = require("../modules/insert.js");
const user = require("../middleware/userAuthontication.js");
const admin = require("../middleware/admin.js");
const userTable = "user";
const jobTable = "job";
const jobApplicationTable = "job_application";
const Update = require("../modules/update.js");
const { table } = require("console");
const Remove = require("../modules/remove.js");
const router = require("../middleware/person.js");
const job=require("./job.js");
const found=require("../modules/IsFoundJobApp.js")
const foundJob=require("../modules/IsFoundJob.js");
class User extends router.Person {
  firstName = ''
  lastName = ''
  phone = ''
  skill = ''
  aboutYou = ''
 get_user_lastName = async(req, res)=> {
      const user = await Get.get(req.params.id, userTable);
      if (!user[0]) {
         return res.status(404).json({ ms: "user not found !" });
      }
        return res.status(200).json(user[0].lastName);
    };
  get_user_phone= async (req, res) => {
      const user = await Get.get(req.params.id, userTable);
      if (!user[0]) {
        return res.status(404).json({ ms: "user not found !" });
      }
      return res.status(200).json(user[0].phone);
    };
  get_user_skill = async (req, res) => {
      const user = await Get.get(req.params.id, userTable);
      if (!user[0]) {
         return res.status(404).json({ ms: "user not found !" });
      }
        return res.status(200).json(user[0].skill);
    };
  get_user_aboutYou = async (req, res) => {
      const user = await Get.get(req.params.id, userTable);
      if (!user[0]) {
        return res.status(404).json({ ms: "user not found !" });
      }
      return res.status(200).json(user[0].aboutYou);
    };
 register= async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const query = util.promisify(conn.query).bind(conn);
      const checkEmailExists = await query(
        "select * from user where email = ?",
        [req.body.email]
      );
      if (checkEmailExists.length > 0) {
        return res.status(400).json({
          errors: [
            {
              msg: "email already exists try another one",
            },
          ],
        });
      }
      const user = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        phone: req.body.phone,
        aboutYou: req.body.aboutYou,
        skill: req.body.skill,
        password: await bcrypt.hash(req.body.password, 10),
        token: crypto.randomBytes(16).toString("hex"),
      };
      await Insert.insert(user, userTable);
      return res.status(200).json({
        user: user,
      });
    } catch (err) {
      return res.status(500).json({ err: err });
    }
  };
get_user_firstName = async (req, res) => {
  const user = await Get.get(req.params.id, userTable);
  if (!user[0]) {
    return res.status(404).json({ ms: "user not found !" });
  }
   return res.status(200).json(user[0].firstName);
};
//SHOW REQUESED JOBS
  show_requested_job= async(req, res) => {
    try {
      const query = util.promisify(conn.query).bind(conn);
      let userId = res.locals.user.id;
      const requestedJobs = await query(`SELECT * FROM job 
                JOIN 
                (SELECT job_id,acceptance FROM job_application WHERE user_id = ?) as users_jobs
                ON job.id = users_jobs.job_id`, [
        userId,
      ]);
      return res.status(200).json(requestedJobs);
    } catch (err) {
      console.log(err);
      return res.status(500).json(err);
    }

  }
  // MAKE application [USER]
apply_on_job=async (req, res) => {
    try {
      const query = util.promisify(conn.query).bind(conn);
      // 1- VALIDATION REQUEST [manual, express validtion]
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      //3- check the number of applicaint to this job 
      const Number_applicaint = await query("select count(job_id) from job_application where job_id =? ",
        [req.body.job_id]);
      if (Number_applicaint <= 10) {
       return  res.status(400).json({ ms: "Job is not available anymore" });
      }
      // 4 - PREPARE job apply OBJECT
      const applyObj = {
        user_id: res.locals.user.id,
        job_id: req.params.id
      };

      // 4- INSERT job OBJECT INTO DATABASE
      await Insert.insert(applyObj, jobApplicationTable);

      return res.status(200).json({
        msg: "apply added successfully !",
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json(err);
    }
  };
  // contact us user
  contactUs=async (req, res) => {
    try {
      const query = util.promisify(conn.query).bind(conn);
      // 1- VALIDATION REQUEST [manual, express validtion]
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });}
      const Obj = {
        email: req.body.email,
        message: req.body.message
      };
    
      // 4- INSERT job OBJECT INTO DATABASE
      await Insert.insert(Obj,"contanctus");

      return res.status(200).json({
        msg: "added successfully !",
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json(err);
    }
  };
}
const userObj=new User();
const jobObj=new job.job();
router.router.get("/get-user-lastName/:id",userObj.get_user_lastName);
router.router.get("/get-user-phone/:id",userObj.get_user_phone)
router.router.get("/get-user-skill/:id",userObj.get_user_skill)
router.router.get("/get-user-aboutYou/:id",userObj.get_user_aboutYou)
router.router.get("/show-job-position/:id",jobObj.getJobPosition)
router.router.get("/show-job-description/:id",jobObj.getJobDescription)
router.router.get("/show-job-qualification/:id",jobObj.getJobQualification)
router.router.get("/show-job-offer/:id",jobObj.getJobOffer)
router.router.get("/show-job-max_candidate_number/:id",jobObj.getJobMaxCandidateNumber)
router.router.get("/show-job-image_url/:id",jobObj.getJobImageURL)
router.router.get("/get-user-firstName/:id",userObj.get_user_firstName)
router.router.get("/show-requestedJobs", user,userObj.show_requested_job)
router.router.post("/apply/:id",user,foundJob,userObj.apply_on_job)
router.router.post("/Register",
  body("email").isEmail().withMessage("please enter a valid email!"),
  body("firstName").isString().withMessage("please enter a valid name"),
  body("lastName").isString().withMessage("please enter a valid name"),
  body("skill").isString().withMessage("please enter a valid skills"),
  body("aboutYou").isString().withMessage("please enter a valid description about your lastJobs"),
  body("phone").isNumeric().isLength({ min: 11, max: 11 }).withMessage("please enter a valid number consists of 11 number"),
  body("password").isLength({ min: 8, max: 10 }).withMessage("password should be between (8-10) character"),userObj.register)
router.router.post("/insert-contactUs", body("email").isEmail().withMessage("please enter a valid email!"),
body("message").isString().withMessage("please enter a valid message"),userObj.contactUs)
module.exports.userRouter=router.router;






