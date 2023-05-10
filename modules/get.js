const util = require("util");
const conn = require("../db/connection");
const { uuid } = require('uuidv4');

const get = async (id, table) => {
    const query = util.promisify(conn.query).bind(conn);
    const user = await query(`select * from ${table} where id = ?`, (id));
    return user;
}
module.exports = { get }