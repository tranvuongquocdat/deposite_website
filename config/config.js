var mysql = require('mysql');

var con = mysql.createConnection({
  host: "localhost",
  port: 3636,
  user: "root",
  password: "",
  database: "deposite_sql"
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});