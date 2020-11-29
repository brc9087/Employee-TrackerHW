var mysql = require("mysql");
var inquirer = require("inquirer");
var consoleTable = require('console.table')

// create the connection information for the sql database
var connection = mysql.createConnection({
  host: "localhost",

  // SQL Workbench link
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "password",
  database: "trackerDB"
});

// connect to the mysql server and sql database
connection.connect(function(err) {
  if (err) throw err;
  // Starts the app
  start();
});

// function which prompts the user for what action they should take
function start() {
  inquirer
    .prompt({
      name: "choice",
      type: "list",
      message: "What would you like to do",
      choices: ["Add departments",
                "Add roles",
                "Add employee",
                "View departments",
                "View roles",
                "View employees",
                "Update employee roles"]

    })
    .then(function(answer) {
      // based on their answer, either call the bid or the post functions
      if (answer.choice === "Add departments") {
        addDepartments();
      }
      else if(answer.choice === "Add roles") {
        addRoles();
      } 
      
      else if(answer.choice === "Add employee") {
        addEmployee();
      }

      else if(answer.choice === "View departments") {
        viewDepartments();
      }

      else if(answer.choice === "View roles") {
        viewRoles();
      }

      else if(answer.choice === "View employees") {
        viewEmployees();
      }

      else if(answer.choice === "Update employee roles") {
        UpdateRoles();
      }

      else{
        connection.end();
      }
    });
}

// === VIEW FUNCTIONS FIRST == //
function viewDepartments() {
    connection.query("SELECT * from department", 
    function(err, res) {
      if (err) throw err
      console.table(res)
      start()
    })
  }

// === VIEW ROLES == //
  function viewRoles() {
    connection.query("SELECT * from role", 
    function(err, res) {
      if (err) throw err
      console.table(res)
      start()
    })
  }

// === VIEW EMPLOYEES == //
  function viewEmployees() {
    connection.query("SELECT * from employee", 
    function(err, res) {
      if (err) throw err
      console.table(res)
      start()
    })
  }


  // === ADD ROLES == //
  function addRoles() { 
    connection.query("SELECT * from role", function(err, res) {
      inquirer.prompt([
          {
            name: "title",
            type: "input",
            message: "What is the title of the role?"
          },
          {
            name: "salary",
            type: "input",
            message: "What is the Salary?"
  
          } 
      ]).then(function(res) {
          connection.query(
              "INSERT INTO role SET ?",
              {
                title: res.Title,
                salary: res.Salary,
              },
              function(err) {
                  if (err) throw err
                  console.table(res);
                  startPrompt();
              }
          )
  
      });
    });
    }

// function to handle posting new items up for auction
function postAuction() {
  // prompt for info about the item being put up for auction
  inquirer
    .prompt([
      {
        name: "item",
        type: "input",
        message: "What is the item you would like to submit?"
      },
      {
        name: "category",
        type: "input",
        message: "What category would you like to place your auction in?"
      },
      {
        name: "startingBid",
        type: "input",
        message: "What would you like your starting bid to be?",
        validate: function(value) {
          if (isNaN(value) === false) {
            return true;
          }
          return false;
        }
      }
    ])
    .then(function(answer) {
      // when finished prompting, insert a new item into the db with that info
      connection.query(
        "INSERT INTO auctions SET ?",
        {
          item_name: answer.item,
          category: answer.category,
          starting_bid: answer.startingBid || 0,
          highest_bid: answer.startingBid || 0
        },
        function(err) {
          if (err) throw err;
          console.log("Your auction was created successfully!");
          // re-prompt the user for if they want to bid or post
          start();
        }
      );
    });
}

function bidAuction() {
  // query the database for all items being auctioned
  connection.query("SELECT * FROM auctions", function(err, results) {
    if (err) throw err;
    // once you have the items, prompt the user for which they'd like to bid on
    inquirer
      .prompt([
        {
          name: "choice",
          type: "rawlist",
          choices: function() {
            var choiceArray = [];
            for (var i = 0; i < results.length; i++) {
              choiceArray.push(results[i].item_name);
            }
            return choiceArray;
          },
          message: "What auction would you like to place a bid in?"
        },
        {
          name: "bid",
          type: "input",
          message: "How much would you like to bid?"
        }
      ])
      .then(function(answer) {
        // get the information of the chosen item
        var chosenItem;
        for (var i = 0; i < results.length; i++) {
          if (results[i].item_name === answer.choice) {
            chosenItem = results[i];
          }
        }

        // determine if bid was high enough
        if (chosenItem.highest_bid < parseInt(answer.bid)) {
          // bid was high enough, so update db, let the user know, and start over
          connection.query(
            "UPDATE auctions SET ? WHERE ?",
            [
              {
                highest_bid: answer.bid
              },
              {
                id: chosenItem.id
              }
            ],
            function(error) {
              if (error) throw err;
              console.log("Bid placed successfully!");
              start();
            }
          );
        }
        else {
          // bid wasn't high enough, so apologize and start over
          console.log("Your bid was too low. Try again...");
          start();
        }
      });
  });
}
