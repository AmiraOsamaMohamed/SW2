const util = require("util");
const conn = require("../db/connection");
const { uuid } = require('uuidv4');

const update = async (userObj, table, userId) => {
    const query = util.promisify(conn.query).bind(conn);
    // let search = table;
    await query(`update ${table} set ? where id = ?`, [userObj, userId]);
    return;
}

module.exports = { update }