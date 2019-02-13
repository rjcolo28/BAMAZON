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
                }, {
                    name: "units",
                    type: "input",
                    message: "How many units would you like to purchase?"
                }
            ])
            .then(function (answer) {
                var choice;
                for (var i = 0; i < response.length; i++) {
                    // response[i].ID.tostring();
                    if (response[i].ID == answer.purchase) {
                        choice = response[i];
                        console.log(choice);
                    }
                }
                

                if (choice.stock_quantity > answer.units) {
                    con.query("UPDATE products SET ? WHERE ?",
                        [
                            {
                                stock_quantity: choice.stock_quantity - answer.units
                            },
                            {
                                ID: choice.ID
                            }
                        ], function(err) {
                            if(err) throw err
                        }
                    )
                    con.query("SELECT * FROM products WHERE price = " + choice.price, function(err) {
                        if(err) throw err;
                        var finalPrice = choice.price * answer.units;
                        console.log(finalPrice);
                        console.log("Thank you for your purchase!")
                        con.end();
                    })
                }
                else {
                    console.log("Insufficient quantity!")
                    makePurchase();
                    return
                };
            })
    })
}