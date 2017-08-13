var mysql = require ('mysql');
var inquirer = require ('inquirer');

var connection = mysql.createConnection ({
	host:'localhost',
	port: 3306,
	user:'root',
	password:"",
	database:'bamazon'
});

connection.connect(function(err){
	if (err) throw err;
	console.log("connected as id " + connection.threadId);
	displayProducts();
});

function displayProducts() {
	connection.query("SELECT * FROM products", function(err, res){
		if (err) throw err;
		for (var i = 0; i < res.length; i++) {
			console.log("\n" + " ID: " + res[i].id + 
						"\n" + " Name: " + res[i].product_name + 
						"\n" + " Department: " + res[i].department_name + 
						"\n" + " Price: " + res[i].price + 
						"\n" + " Stock Quantity: " + res[i].stock_quantity + "\n");
		console.log("---------------------------");		
		}
	buyItem();
	});


}

function buyItem () {

	inquirer
		.prompt([
			{
			  name: "item",
			  type: "input",
			  message: "What is the ID of the product you would like to purchase?",
			},
			{
			  name: "quantity",
			  type: "input",
			  message: "How many units of the product would you like to buy?"
			}
		])
		.then(function(answer) {
			var query = "SELECT id, product_name, stock_quantity, price FROM products WHERE ?";
			connection.query(query, { id: answer.item }, function(err, results) {
				if (err) throw err;
				for (var i = 0; i < results.length; i++) {
					console.log(" ID: " + results[i].id + " | " + " Name: " + results[i].product_name + " | " + " Price: " + results[i].price + " | " + " Stock: " + results[i].stock_quantity);
				
					if (results[i].stock_quantity > answer.quantity) {
						console.log("We have some in stock!");
						var stockQuantity = results[i].stock_quantity - answer.quantity;
						var totalCost = results[i].price * answer.quantity;
						connection.query("UPDATE products SET stock_quantity = ? WHERE id = ?", [stockQuantity, answer.item], function (error, results){
							if (error) throw error;
							console.log("Total cost: " + totalCost);
						});

					} else {
						console.log("Insufficient quantity!");
					}
				}


			});	
		});
}








