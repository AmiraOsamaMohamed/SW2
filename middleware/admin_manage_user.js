const { uuid } = require('uuidv4');
const conn = require("../db/connection");
const { body, validationResult } = require("express-validator");
const admin = require("./admin");
const util = require("util");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const Update = require("../modules/update.js");
const Get = require("../modules/get.js");
const Remove = require("../modules/remove.js");
const Insert = require("../modules/insert.js");
const userTable = "user";
const jobTable = "job";
const jobApplicationTable="job_application"
const router = require("./person");
const found=require("../modules/IsFoundUser.js");
const  foundJob=require("../modules/IsFoundJobApp");
class AdminManageUser extends router.Person {
  //////////////////update first name of user////////////
  updateUserFirstName = async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const userObj = {
        firstName: req.body.firstName,
      };
      await Update.update(userObj, userTable, req.params.id);
      return res.status(200).json({
        msg: "user updated successfully",
      });
    } catch (err) {
      return res.status(500).json(err);
    }
  }
  //////////////////update last name of user////////////
  updateUserLastName = async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const userObj = {
        lastName: req.body.lastName,
      };
      await Update.update(userObj, userTable, req.params.id);
      return res.status(200).json({
        msg: "user updated successfully",
      });
    } catch (err) {
      return res.status(500).json(err);
    }
  }
  //////////////////update email of user//////////// 
  updateUserEmail = async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      } 
      const userObj = {
        email: req.body.email,
      };
      await Update.update(userObj, userTable, req.params.id);
      return res.status(200).json({
        msg: "user updated successfully",
      });
    } catch (err) {
      return res.status(500).json(err);
    }
  }

  //////////////////update password of user////////////
  updateUserPassword = async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const userObj = {
        password: await bcrypt.hash(req.body.password, 10)
      };

      await Update.update(userObj, userTable, req.params.id);

      return res.status(200).json({
        msg: "user updated successfully",
      });
    } catch (err) {
      return res.status(500).json(err);
    }
  }
  //////////////////update phone of user////////////
  updateUserPhone = async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const userObj = {
        phone: req.body.phone,
      };

      await Update.update(userObj, userTable, req.params.id);

      return res.status(200).json({
        msg: "user updated successfully",
      });
    } catch (err) {
      return res.status(500).json(err);
    }
  }
             //////////////////update status of user////////////
  updateUserStatus = async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const userObj = {
        status: req.body.status,
      };

      await Update.update(userObj, userTable, req.params.id);

      return res.status(200).json({
        msg: "user updated successfully",
      });
    } catch (err) {
      return res.status(500).json(err);
    }
  }
  //             //////////////////update skill of user////////////
  updateUserSkill = async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const userObj = {
        skill: req.body.skill,
      };

      await Update.update(userObj, userTable, req.params.id);

      return res.status(200).json({
        msg: "user updated successfully",
      });
    } catch (err) {
      return res.status(500).json(err);
    }
  }
  // update_user_aboutYou ///
  updateUserAboutYou = async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const userObj = {
        aboutYou: req.body.aboutYou,
      };

      await Update.update(userObj, userTable, req.params.id);

      return res.status(200).json({
        msg: "user updated successfully",
      });
    } catch (err) {
      return res.status(500).json(err);
    }
  }
  /////////////assignment user///////////////
  createUser = async (req, res) => {
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
      const newUser = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        phone: req.body.phone,
        skill: req.body.skill,
        aboutYou: req.body.aboutYou,
        password: await bcrypt.hash(req.body.password, 10),
        token: crypto.randomBytes(16).toString("hex"),
      };
      await Insert.insert(newUser, userTable);
      return res.status(200).json(newUser);
    } catch (err) {
      return res.status(500).json(err);
    }
  }
  // //###########delete spacific user
  deleteUser = async (req, res) => {
    try {
      await Remove.remove(req.params.id, userTable);
      return res.status(200).json({
        msg: "user delete successfully",
      });
    } catch (err) {
      return res.status(500).json(err);
    }
  }
////////////////////
  // //####list users
  getUser = async (req, res) => {
    const query = util.promisify(conn.query).bind(conn);
    const users = await query("select * from user ");
    return res.status(200).json(users);
  }
//###########update in acceptance of job [admin]
update_job_acceptance= async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const jobObj = {
      acceptance: req.body.acceptance
    };
    await Update.update(jobObj, jobApplicationTable, req.params.id);

    return res.status(200).json({
      msg: "Acceptance updated successfully",
    });
  } catch (err) {
    return res.status(500).json(err);
  }
};
}
const adminObject = new AdminManageUser();
router.router.put('/update-user-firstName/:id', admin,found,
  body("firstName").isString().withMessage("please enter a valid first name"), adminObject.updateUserFirstName);
router.router.put('/update-user-lastName/:id', admin,found,
  body("lastName").isString().withMessage("please enter a valid last name"), adminObject.updateUserLastName);
router.router.put('/update-user-email/:id', admin,found,
  body("email").isEmail().withMessage("please enter a valid email"), adminObject.updateUserEmail);
router.router.put('/update-user-password/:id', admin,found,
  body("password").isLength({ min: 8, max: 10 }).withMessage("password should be between (8-10) character"),
  adminObject.updateUserPassword);
router.router.put('/update-user-phone/:id', admin,found,
  body("phone").isNumeric().isLength({ min: 11, max: 11 }).withMessage("please enter a valid number consists of 11 number"),
  adminObject.updateUserPhone);
router.router.put('/update-user-status/:id', admin,found,
  body("status").isNumeric().withMessage("please enter a valid number").isLength(1).withMessage("status is 0 ==>active or 1==>inactive"),
  adminObject.updateUserStatus);
router.router.put('/update-user-skill/:id', admin,found,
  body("skill").isString().withMessage("please enter a valid skills"), adminObject.updateUserSkill);
router.router.put('/update-user-aboutYou/:id', admin,found,
  body("aboutYou").isString().withMessage("please enter a valid description about your last job"),
  adminObject.updateUserAboutYou);
router.router.post("/create-user", admin,
  body("firstName").isString().withMessage("please enter a valid first name"),
  body("lastName").isString().withMessage("please enter a valid last name "),
  body("email").isEmail().withMessage("please enter a valid email "),
  body("phone").isNumeric().isLength({ min: 11, max: 11 }).withMessage("please enter a valid number consists of 11 number"),
  body("password").isLength({ min: 8, max: 10 }).withMessage("password should be between (8-10) character"),
  body("skill").isString().withMessage("please enter a valid skill "),
  body("aboutYou").isString().withMessage("please enter a valid description about your last job "),
  adminObject.createUser);
router.router.delete('/delete-user/:id', admin,found, adminObject.deleteUser);
router.router.get('/get-users', admin, adminObject.getUser);
router.router.put('/update-job-acceptance/:id', admin,foundJob,
  body("acceptance").isBoolean().withMessage("please enter a valid job acceptance"),adminObject.update_job_acceptance)
module.exports=router.router
