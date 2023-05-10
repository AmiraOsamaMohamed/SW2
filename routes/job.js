const conn = require("../db/connection.js");
const fs = require('fs');
const util = require("util"); // helper
const { uuid } = require('uuidv4');
const { body, validationResult } = require("express-validator");
const router = require("express").Router();
const Update = require("../modules/update.js");
const Get = require("../modules/get.js");
const Remove = require("../modules/remove.js");
const Insert = require("../modules/insert.js");
const userTable = "user";
const jobTable = "job";
class Job {
  position = ''
  description = ''
  offer = ''
  qualification = ''
  max_candidate_number = 0
  image_url = ''
  getJobPosition = async (req, res) => {
    const job = await Get.get(req.params.id, jobTable);
    if (!job[0]) {
      return res.status(404).json({ ms: "job not found !" });
    }
    return res.status(200).json(job[0].position);
  }

  getJobDescription = async (req, res) => {
    const job = await Get.get(req.params.id, jobTable);
    if (!job[0]) {
       return res.status(404).json({ ms: "job not found !" });
    }
     return res.status(200).json(job[0].description); 
         
  }
  getJobQualification = async (req, res) => {
    const job = await Get.get(req.params.id, jobTable);
    if (!job[0]) {
      return res.status(404).json({ ms: "job not found !" });
    }
    return res.status(200).json(job[0].qualification);
  }
  getJobOffer = async (req, res) => {
    const job = await Get.get(req.params.id, jobTable);
    if (!job[0]) {
      return res.status(404).json({ ms: "job not found !" });
    }
    return res.status(200).json(job[0].offer);
  }
  getJobMaxCandidateNumber = async (req, res) => {
    const job = await Get.get(req.params.id, jobTable);
    if (!job[0]) {
      return res.status(404).json({ ms: "job not found !" });
    }
    return res.status(200).json(job[0].max_candidate_number);
  }
  getJobImageURL = async (req, res) => {
    const job = await Get.get(req.params.id, jobTable);
    if (!job[0]) {
      return res.status(404).json({ ms: "job not found !" });
    }
    return res.status(200).json(job[0].image_url = "http://" + req.hostname + ":4000/" + job[0].image_url);
  }

}
const jobObj = new Job();
router.get("/get-job-position/:id", jobObj.getJobPosition);
router.get("/get-job-description/:id", jobObj.getJobDescription);
router.get("/get-job-qualification/:id", jobObj.getJobQualification);
router.get("/get-job-offer/:id", jobObj.getJobOffer);
router.get("/get-job-max_candidate_number/:id", jobObj.getJobMaxCandidateNumber)
router.get("/get-job-image_url/:id", jobObj.getJobImageURL)
module.exports.router = router;
module.exports.job=Job;

