const conn= require("../db/connection.js");
const util = require("util");
const user=async(req,res,next)=>{
    const query = util.promisify(conn.query).bind(conn);
    const {token}=req.headers;
    const user = await query("select * from user where token = ?", [token]);
    if(user[0] && user[0].type=="0") {
        res.locals.user = user[0];
        next();}
    else{
        res.status(403).json({
              message:"You are not autharized"
        });
    }
    };
    module.exports=user;