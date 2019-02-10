var mysql = require("mysql");

var inquirer = require("inquirer")

var con = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "R0ssm00r#25",
    database: "bamazon"
});

var command = process.argv[2];

if (command === "customer") {
    con.connect(function (err) {
        if (err) throw err;
        console.log("You are connected!");
    });
    makePurchase();
}

function makePurchase() {
    con.query("SELECT * FROM products", function (err, response) {
        if (err) throw err;
        console.log(response);
        inquirer
            .prompt([
                {
                    name: "purchase",
                    type: "rawlist",
                    choices: function () {
                        var productArr = [];
                        for (var i = 0; i < response.length; i++) {
                            productArr.push(response[i].ID.toString());
                        }
                        return productArr;
                    },
                    message: "Choose what product you wish to purchase (by ID)."
                }
            ])
            .then(function (answer) {
                console.log(answer.purchase);
            })
    })
}