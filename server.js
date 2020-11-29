var mysql = require("mysql");
var inquirer = require("inquirer");
var consoleTable = require("console.table")

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
connection.connect(function (err) {
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
                // "Add roles",
                "Add employee",
                "View departments",
                // "View roles",
                "View employees",
                "Update employee roles"]

        })
        .then(function (answer) {
            // based on their answer, either call the bid or the post functions
            if (answer.choice === "Add departments") {
                addDepartments();
            }
            // else if (answer.choice === "Add roles") {
            //     addRoles();
            // }

            else if (answer.choice === "Add employee") {
                addEmployee();
            }

            else if (answer.choice === "View departments") {
                viewDepartments();
            }

            // else if (answer.choice === "View roles") {
            //     viewRoles();
            // }

            else if (answer.choice === "View employees") {
                viewEmployees();
            }

            else if (answer.choice === "Update employee roles") {
                UpdateRoles();
            }

            else {
                connection.end();
            }
        });
}

// === VIEW FUNCTIONS FIRST == //
function viewDepartments() {
    connection.query("SELECT * from department",
        function (err, res) {
            if (err) throw err
            console.table(res)
            start()
        })
}

// === VIEW ROLES == //
// function viewRoles() {
//     connection.query("SELECT * from role",
//         function (err, res) {
//             if (err) throw err
//             console.table(res)
//             start()
//         })
// };

// === VIEW EMPLOYEES == //
function viewEmployees() {
    connection.query("SELECT * from employee",
        function (err, res) {
            if (err) throw err;
            console.table(res);
            start()
        })
};


// === ADD ROLES == //
// function addRoles() {
//         inquirer.prompt([
//             {
//                 name: "title",
//                 type: "input",
//                 message: "What is the title of the role?"
//             },
//             {
//                 name: "salary",
//                 type: "input",
//                 message: "What is the salary?"

//             }
//         ]).then(function (res) {
//             connection.query(
//                 "INSERT INTO employee SET ?",
//                 {
//                     title: res.title,
//                     salary: res.salary,
//                 },
//                 function (err) {
//                     if (err) throw err
//                     console.table(res);
//                     start();
//                 }
//             )
//         });
// }

// === ADD DEPARTMENTS == //
function addDepartments() {
    inquirer.prompt([
        {
            name: "name",
            type: "input",
            message: "What Department would you like to add?"
        }
    ]).then(function (res) {
        var query = connection.query("INSERT INTO department SET ? ",
            {
                name: res.name

            },
            function (err) {
                if (err) throw err
                console.table(res);
                start();
            }
        )
    })
}

// === ADD EMPLOYEE == //
function addEmployee() {
    inquirer.prompt([
        {
            name: "firstname",
            type: "input",
            message: "Enter their first name"
        },
        {
            name: "lastname",
            type: "input",
            message: "Enter their last name"
        },
        {
            name: "title",
            type: "input",
            message: "What is the title of the role?"
        },
        {
            name: "salary",
            type: "input",
            message: "What is the salary?"
        }

    ]).then(function (res) {
        connection.query("INSERT INTO employee SET ?",
            {
                first_name: res.firstname,
                last_name: res.lastname,
                title: res.title,
                salary: res.salary
            },
            function (err) {
                if (err) throw err
                console.table(res)
                start()
            })
    }
    )
}

// === UPDATE EMPLOYEE ROLES === //
function UpdateRoles() {
    connection.query("select * from employee", function (err, res) {
        if (err) throw err;

        console.table(res)
        inquirer.prompt([
            {
                name: "choice",
                type: "list",
                message: "Please select the id# associated with employee you want to update role",
                choices: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14",
                    "15", "16", "17", "18", "19", "20"]
            },

            {
                name: "newrole",
                type: "input",
                message: "Please enter a new role"
            }

        ]).then(function (res) {
            connection.query("UPDATE employee SET title = ?  WHERE id = ?", [res.newrole, res.choice],
                function (err) {
                    if (err) throw err
                    console.table(res)
                    start()
                })

        });
    });

}

