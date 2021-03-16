"use strict";

const dayjs = require("dayjs");
const sqlite = require("sqlite3");

// TASK MANAGEMENT
function Task(id, description, urgent = false, priv = true, deadline = null) {
    this.id = id;
    this.description = description;
    this.urgent = urgent;
    this.priv = priv;
    this.deadline = deadline;

    this.printTask = () => {
        let deadlineStr;
        if(deadline==null)
            deadlineStr = "absent";
        else 
            deadlineStr = deadline.format('MMMM D, YYYY h:mm A');
        
        console.log(`Id: ${id}, Description: ${description}, Urgent: ${urgent}, Private: ${priv}, Deadline: ${deadlineStr}`);
    };
}

function Tasklist(tasks) {
    if(tasks === undefined)
        this.tasks = [];
    else 
        this.tasks = [...tasks];

    this.addTask = (task) => this.tasks.push(task);

    this.sortAndPrint = function () {
        console.log("****** Tasks sorted by deadline (most recent first): ******");
        this.tasks.sort((a,b) => dayjs(a).isAfter(dayjs(b)) ? 1 : -1)
                .forEach(t => t.printTask());
       
    };

    this.filterAndPrint = function () {
        console.log("****** Tasks filtered, only (urgent == true): ******");
        this.tasks.filter(t => t.urgent)
                .forEach(t => t.printTask());
    };
}

// DB MANAGEMENT
const db = new sqlite.Database('tasks.db', (err) => { if (err) throw err; });

function callbackReturnTasksQuery(resolve, reject, err, rows) {
    if(err)
        reject(err);
    else {
        let tasks = new Tasklist();
        for(let row of rows) {
            if(row.deadline == null)
                tasks.addTask(new Task(row.id, row.description, Boolean(row.urgent), Boolean(row.private)));
            else 
                tasks.addTask(new Task(row.id, row.description, Boolean(row.urgent), Boolean(row.private), dayjs(row.deadline)));
        };  
        resolve(tasks);
    };
}

// Query 1
async function loadAllTasks() {
    const querySelectAllTasks = "SELECT * FROM tasks";
    
    return new Promise((resolve, reject) => {
        db.all(querySelectAllTasks, (err, rows) => callbackReturnTasksQuery(resolve, reject, err, rows)) });
}

// Query 2
async function loadTasksAfterDeadline(date) {
    const querySelectTasksAfterDeadline = "SELECT * FROM tasks WHERE deadline > ?";
    
    return new Promise((resolve, reject) => {
        db.all(querySelectTasksAfterDeadline, [date.format()], (err, rows) => callbackReturnTasksQuery(resolve, reject, err, rows)) });
}

// Query 3
async function loadTasksContainingWord(word) {
    const querySelectTasksContainingWord = `SELECT * FROM tasks WHERE description LIKE  "%${word}%"`;
    
    return new Promise((resolve, reject) => {
        db.all(querySelectTasksContainingWord, (err, rows) => callbackReturnTasksQuery(resolve, reject, err, rows)) });
}


async function main() {
    let myArgs = process.argv.slice(2);  
    
    if(myArgs.length != 2) {
        console.log("Errore -> parametri mancanti!");
        return;
    };
    
    // Query 1
    console.log("All tasks in the database :");
    let result = await loadAllTasks();
    result.tasks.forEach(x => x.printTask());
    console.log("");

    // Query 2
    console.log("Tasks after deadline '" + dayjs(myArgs[0]).format('MMMM D, YYYY h:mm A') + "' :");
    result = await loadTasksAfterDeadline(dayjs(myArgs[0]));
    result.tasks.forEach(x => x.printTask());
    console.log("");

    // Query 3
    console.log("Tasks with description containing word '" + myArgs[1] + "' :");
    result = await loadTasksContainingWord(myArgs[1]);
    result.tasks.forEach(x => x.printTask());

    db.close();
}

main();  // example: run with "node lab1.js 2021-03-10 lab"