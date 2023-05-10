const util = require("util");
const conn = require("../db/connection");
const { uuid } = require('uuidv4');
const Get = require("./get.js");
isFound = async (req, res,next) => {
    const object = await Get.get(req.params.id,"user");
    if (!object[0]) {
       return res.status(404).json({ ms: "object not found !" });
    }
     next();
         
  }
module.exports=isFound;