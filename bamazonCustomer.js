var mysql = require("mysql");

var con = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "R0ssm00r#25",
    database: "bamazon"
});

con.connect(function(err) {
    if (err) throw err;
    console.log("connected");
    con.query("SELECT * FROM products", function(err, results) {
        if (err) throw err;
        console.log(results);
    });
    con.end();
});