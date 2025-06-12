const { Pool } = require("pg");
require("dotenv").config();

// The Pool will manage multiple client connections for us.
const pool = new Pool({
	user: process.env.DB_USER,
	host: process.env.DB_HOST,
	database: process.env.DB_DATABASE,
	password: process.env.DB_PASSWORD,
	port: process.env.DB_PORT,
});

// We export a single query function to use throughout our app.
module.exports = {
	query: (text, params) => pool.query(text, params),
};
