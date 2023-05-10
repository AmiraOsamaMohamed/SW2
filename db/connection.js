const mysql      = require('mysql');
const connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'Employment Dashboard',
  port:"3306"
});
 
connection.connect((err)=> {
    if (err) {
      console.error('error connecting');
      return;
    }
   
    console.log('connected sucessfully');
  });
 
module.exports=connection;