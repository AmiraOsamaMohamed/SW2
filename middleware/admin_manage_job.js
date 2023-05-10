const conn = require("../db/connection");
const { uuid } = require('uuidv4');
const admin = require("./admin");
const user = require("./userAuthontication");
const autharized = require("../authontication/author");
const { body, validationResult } = require("express-validator");
const upload = require("./uploadImages");
const util = require('util'); // helper
const fs = require('fs'); // file system
const Insert = require("../modules/insert.js");
const Update = require("../modules/update.js");
const { table } = require("console");
const Get = require("../modules/get.js");
const Remove = require("../modules/remove.js");
const userTable = "user";
const jobTable = "job";
const jobApplicationTable = "job_application";
const router = require("./person");
const found=require("../modules/IsFoundJob.js");
class AdminManageJob extends router.Person{
///###############create job
create_job= async (req,res)=> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      if (!req.file) {
        return res.status(400).json({
          errors: [
            {
              msg: "Image is Required",
            },
          ],
        });
      }
      const newJob = {
        position: req.body.position,
        description: req.body.description,
        offer: req.body.offer,
        qualification: req.body.qualification,
        max_candidate_number: req.body.max_candidate_number,
        image_url: req.file.filename,
      };
      await Insert.insert(newJob, jobTable);
      return res.status(200).json({
        newJob: newJob,
      });
    } catch (err) {
      return res.status(500).json(err);
    }
  };
//##########update position of job
update_job_position =async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const jobObj = {
        position: req.body.position,
      };
     
      await Update.update(jobObj, jobTable, req.params.id);
      return res.status(200).json({
        msg: "job updated successfully",
      });
    } catch (err) {
      return res.status(500).json(err);
    }
  };
// #########update description of job
  update_job_description =async (req, res) => {
      try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
        }
        const jobObj = {
          description: req.body.description,
        };
        await Update.update(jobObj,jobTable,req.params.id);
        return res.status(200).json({
          msg: "job updated successfully",
        });
      } catch (err) {
        return res.status(500).json(err);
      }
    };

// //#######update qualification of job
update_job_qualification=async (req, res) => {
      try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
        }
        const jobObj = {
          qualification: req.body.qualification
        };

        await Update.update(jobObj, jobTable, req.params.id);

        return res.status(200).json({
          msg: "job updated successfully"
        });
      } catch (err) {
       return  res.status(500).json(err);
      }
    };

// //#######update in offer of job
update_job_offer =async (req, res) => {
      try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
        }
        const jobObj = {
          offer: req.body.offer,
        };

        await Update.update(jobObj, jobTable, req.params.id);

        return res.status(200).json({
          msg: "job updated successfully",
        });
      } catch (err) {
        return res.status(500).json(err);
      }
    };

// //###########update in max_candidate_number of job
update_job_maxCandidateNumber =async (req, res) => {
      try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
        }
        const jobObj = {
          max_candidate_number: req.body.max_candidate_number,
        };

        await Update.update(jobObj, jobTable, req.params.id);

        return res.status(200).json({
          msg: "job updated successfully",
        });
      } catch (err) {
        return res.status(500).json(err);
      }
    };
// //############update image of job
update_job_image_url =async (req, res) => {
      try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
        }
        const jobObj = {
          image_url: req.file.filename
        };

        if (req.file) {
          jobObj.image_url = req.file.filename;
        }
        await Update.update(jobObj, jobTable, req.params.id);

        return res.status(200).json({
          msg: "job updated successfully",
        });
      } catch (err) {
        return res.status(500).json(err);
      }
    };
// UPDATE MOVIE [ADMIN]
update_allDataOfSpecificJob=async (req, res) => {
    try {
      const query = util.promisify(conn.query).bind(conn);
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      // 3- PREPARE MOVIE OBJECT
      const jobObj = {
        position: req.body.position,
        description: req.body.description,
        offer: req.body.offer,
        qualification: req.body.qualification,
        max_candidate_number: req.body.max_candidate_number 
      };

      if (req.file) {
        jobObj.image_url = req.file.filename;
       
      }
      await Update.update(jobObj, jobTable, req.params.id);
      res.status(200).json({
        msg: "job updated successfully",
      });
    } catch (err) {
      res.status(500).json(err);
    }
  };
// //###########delete job
delete_job =async (req, res) => {
      try {
        await Remove.remove(req.params.id, jobTable);
        return res.status(200).json({
          msg: "job delete successfully",
        });
      } catch (err) {
        return res.status(500).json(err);
      }
    };

//SHOW REQUESED JOBS for admin
get_requested_jobs= async(req, res) => {
  try {
    const query = util.promisify(conn.query).bind(conn);
    // let userId = res.locals.user.id;
    const requestedJobs = await query(`SELECT user_id,job_id,acceptance,qualification,firstName,phone,skill,status,description,position 
    from user join job_application 
    on user_id=user.id
    join job
    on job_id=job.id` 
    );
    return res.status(200).json(requestedJobs);
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }

}
// // SHOW job [ADMIN, USER]
show_specific_job=async (req, res) => {
  const job = await Get.get(req.params.id, jobTable);
  if (!job[0]) {
   return  res.status(404).json({ ms: "job not found!" });
  }
  job[0].image_url = "http://" + req.hostname + ":4000/" + job[0].image_url;
  return res.status(200).json(job[0]);
};
}
const AdminObj=new AdminManageJob();
router.router.post("/create-job", admin, upload.single("image"),
  body("position").isString().withMessage("please enter a valid job position"),
  body("description").isString().withMessage("please enter a valid description "),
  body("offer").isString().withMessage("please enter a valid offer "),
  body("qualification").isString().withMessage("please enter a valid qualification "),
  body("max_candidate_number").isNumeric().withMessage("please enter a valid number "),AdminObj.create_job)
router.router.put('/update-job-position/:id', admin,found,
  body("position").isString().withMessage("please enter a valid job position"),AdminObj.update_job_position)
router.router.put('/update-job-description/:id', admin,found,
    body("description").isString().withMessage("please enter a valid job description"),AdminObj.update_job_description)
router.router.put('/update-job-qualification/:id', admin,found,
    body("qualification").isString().withMessage("please enter a valid job qualification"),AdminObj.update_job_qualification)
router.router.put('/update-job-offer/:id', admin,found,
    body("offer").isString().withMessage("please enter a valid job offer"),AdminObj.update_job_offer)
router.router.put('/update-job-maxCandidateNumber/:id', admin,found,
    body("max_candidate_number").isNumeric().withMessage("please enter a valid job max_candidate_number"),AdminObj.update_job_maxCandidateNumber)
router.router.put('/update-job-image_url/:id', admin,found,upload.single("image"),AdminObj.update_job_image_url)
router.router.delete('/delete-job/:id', admin,found,AdminObj.delete_job)
router.router.put("/update-all-data-of-specific-job/:id", admin, upload.single("image"),
  body("position").isString().withMessage("please enter a valid job position"),
  body("description").isString().withMessage("please enter a valid description "),
  body("offer").isString().withMessage("please enter a valid offer "),
  body("qualification").isString().withMessage("please enter a valid qualification "),
  body("max_candidate_number").isNumeric().withMessage("please enter a valid number "),found,
  AdminObj.update_allDataOfSpecificJob)
router.router.get("/get-requestedJobs",admin,AdminObj.get_requested_jobs);
router.router.get("/show-specific-job/:id",admin,AdminObj.show_specific_job)
module.exports=router.router;