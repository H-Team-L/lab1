function TaskList(taskList) {
    this.list = taskList;
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

function Task(id, description, date) {
    this.id = id
    this.description = description
    this.urgent = false
    this.private = true
    if (date == null) this.deadline = new Date()
    else this.deadline = date
}

const tasks = new TaskList([new Task(1, "Descrizione1", null), new Task(2, "Nuova Descrizione", new Date("1990/02/03"))])
tasks.list.push(new Task(3, "Descrizione3", null))
tasks.sortAndPrint()
tasks.filterAndPrint()