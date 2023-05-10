const util = require("util");
const conn = require("../db/connection");
const { uuid } = require('uuidv4');

const insert = async (user, table) => {
    const query = util.promisify(conn.query).bind(conn);
    await query(`insert into ${table} set ? `, user);
    return;
}
module.exports = { insert }