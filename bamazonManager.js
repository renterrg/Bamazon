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
	menu();
});

function menu() {
	inquirer
		.prompt({
			name:"menu",
			type:"list",
			message:"What would you like to do?",
			choices: [
				"View products for sale",
				"View low inventory",
				"Add to inventory",
				"Add new product"
			]
		})
		.then(function(answer){
			switch (answer.menu) {
				case "View products for sale":
					viewProducts();
					break;

				case "View low inventory":
					lowInventory();
					break;

				case "Add to inventory":
					addInventory();
					break;

				case "Add new product":
					addProduct();
					break;
			}
		});
}

function viewProducts() {
	connection.query("SELECT * FROM products", function(err, res){
		if (err) throw err;
		for (var i = 0; i < res.length; i++) {
			console.log("\n" + " ID: " + res[i].id + 
						"\n" + " Name: " + res[i].product_name + 
						"\n" + " Price: " + res[i].price + 
						"\n" + " Stock Quantity: " + res[i].stock_quantity + "\n");
		console.log("---------------------------");		
		}
	});
}

function lowInventory() {
	connection.query("SELECT * FROM products WHERE stock_quantity < 5", function(err, res){
		if (err) throw err;
		for (var i = 0; i < res.length; i++) {
			console.log("\n" + " Name: " + res[i].product_name + "\n" + " Stock Quantity: " + res[i].stock_quantity + "\n");
		}
	});
}

function addInventory() {

	inquirer
		.prompt([
			{
				name: "item",
				type: "input",
				message: "What is the ID of the item you would like to select?"
			},
			{
				name: "quantity",
				type: "input",
				message: "How many units of this product would you like to add?"
			}
		])
		.then(function(answer){
			var query = "SELECT id, stock_quantity FROM products WHERE ?";
			connection.query(query, { id: answer.item }, function(err, results){
				if (err) throw err;

				for (var i = 0; i < results.length; i++) {
					var oldQuantity = parseInt(results[i].stock_quantity);
					var newQuantity = oldQuantity + parseInt(answer.quantity);
					connection.query("UPDATE products SET stock_quantity = ? WHERE id = ?", [newQuantity, answer.item], function(err, res){
						if (err) throw err;
						console.log("Previous stock quantity: " + oldQuantity + " | " + " New stock quantity: " + newQuantity);
					});
				}
			});
		});
}









