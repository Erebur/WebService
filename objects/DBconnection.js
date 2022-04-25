const mysql = require("mysql");

const con = mysql.createConnection({
    host: "devel1", user: "root", password: "the27", database: "Carlos"
});

con.connect(function (err) {
    if (err) console.log(err)
    else console.log("Connected!")
});


module.exports = con;