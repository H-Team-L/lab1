/* Francesco Cartelli - 16/03/2021 */

const sqlite3 = require('sqlite3').verbose();

function TaskList() {
    this.list = []

    /* Fetch all data from database table and load into this.list */
    /* param - alsoPrint    : if true prints the data */
    /* param - afterDate    : if not null fetches only tasks after the specified date */
    /* param - pattern      : if not null fetches only tasks with specified pattern in title or description */
    this.getAll = (alsoPrint = true, afterDate = null, pattern = null) => {
        new Promise((resolve, reject) => {
            const db = new sqlite3.Database('tasks.db', (err) => {
                if(err) return console.error(err.message)
                console.log('Connected')
            })

            let query = 'SELECT * FROM TASKLIST'
            let isMore = false
            if(afterDate != null) {
                query += ' WHERE deadline > ' + afterDate
                isMore = true
            }
            if(pattern != null) {
                if(isMore) query = query + ' AND (id LIKE "%'  + pattern + '%" OR description LIKE "%' + pattern + '%")'
                else ' WHERE (id LIKE "%'  + pattern + '%" OR description LIKE "%' + pattern + '%")'
            }

            db.all(query, (err, rows) => {
                if (err) reject("Error")
                else resolve(rows)
            })
            db.close()
        }).then((rows) => {
            rows.forEach(row => { 
                this.list.push(new Task(row['id'], row['description'], row['urgent'], row['private'], row['deadline']))
            })
            if(alsoPrint) this.sortAndPrint()
        }).catch((y) => {
            console.log(y)
        })
    }
    this.sortAndPrint = () => {
        console.log("Sorted Tasks: ")
        const sorted = this.list.sort((a, b) => (a.deadline > b.deadline) ? 1 : -1);
        sorted.forEach(element => {
            this.print(element)
        })
    }
    this.filterAndPrint = () => {
        console.log("Urgent Tasks: ")
        this.list.forEach(element => {
            if(element.urgent) this.print(element)
        })
    }
    this.print = (task) => {
        console.log("Task " + task.id + ": " + task.description + "\tDeadline: " + task.deadline)
    }
}

function Task(id, description, urgent = false, private = true, deadline = null) {
    this.id = id
    this.description = description
    this.urgent = false
    this.private = true
    if (deadline == null) this.deadline = new Date()
    else this.deadline = deadline
}


/* ------------------------- */
/*  Effective execution part */ 
/* ------------------------- */
const list = new TaskList()

/* Get and print all task after 2020-01-01 and with pattern 1 in description or id */
list.getAll(true, '2020-06-05', 'e')