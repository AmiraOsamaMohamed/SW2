const util = require("util");
const conn = require("../db/connection");
const { uuid } = require('uuidv4');

const remove  = async (id, table) => {
    const query = util.promisify(conn.query).bind(conn);
    let search = table;
    await query(`delete from ${table} where id = ?`, id);
    return;
}
module.exports = { remove }