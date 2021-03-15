/* ESERCIZIO 2 */
'use strict';
const dayjs = require('dayjs');
const sqlite = require('sqlite3');

function Task(id, desc, urgent = false, isPrivate = false, deadline = null ) {    
    this.id=id;
    this.desc=desc;
    this.urgent=urgent;
    this.isPrivate=isPrivate;
    this.deadline=deadline    

    this.toString = () => {
        let deadlineStr='<not defined>'
        if (deadline.isValid())
            deadlineStr=this.deadline.format('MMMM D, YYYY h:mm A');
        return 'Id: '+this.id+', Description: '+this.desc+', Urgent: '+this.urgent+', Private: '+this.isPrivate+','+
        ' Deadline: '+deadlineStr;
    }
}

function TaskList() {
    this.myL=[];    
    this.add = (Task) => {
        this.myL.push(Task);        
    }    

    this.sortAndPrint = () => {
        let sortedArr=this.myL.sort( (a,b) => {            
            return b.deadline-a.deadline;
        });
        console.log('****** Tasks sorted by deadline (most recent first): ******');        
        for (let tsk of sortedArr) {                        
            console.log(tsk.toString());        
        }
    }
    this.filterAndPrint = () => {
        let sortedArr=this.myL.filter(task => task.urgent );
        console.log('****** Tasks filtered, only (urgent == true): ******');        
        for (let tsk of sortedArr) {
            console.log(tsk.toString());        
        }
    }    

    this.callBack = (resolve, reject, err,rows) => {                
        if (err)
            reject(err);
        else {
            for (let row of rows) {                
                let tsk = new Task(row.id,row.description, row.urgent, row.private, dayjs(row.deadline));
                this.add( tsk );
                console.log(tsk.toString());
            }                              
            resolve(true);
        }                    
    }

    this.getDBTasks = async () => {
        const SQL_SELECT_TASKLIST = 'SELECT ID, DESCRIPTION, URGENT, PRIVATE, DEADLINE FROM TASKLIST';      
    
        return new Promise((resolve,reject) => {
            db.all(SQL_SELECT_TASKLIST, (err, rows) => {
                this.callBack(resolve,reject,err,rows);                   
            });
        });
    }

    this.getDBTasksDeadline = async (deadline) => {
        const SQL_SELECT_TASKLIST_DEADLINE = 'SELECT ID, DESCRIPTION, URGENT, PRIVATE, DEADLINE '+
          'FROM TASKLIST WHERE DEADLINE>?';      
    
        return new Promise((resolve,reject) => {            
            db.all(SQL_SELECT_TASKLIST_DEADLINE, deadline.toString(), (err,rows) => {
                this.callBack(resolve,reject,err,rows);
            });
        });
    }

    this.getDBTasksContainingWord = async (searchWord) => {
        const SQL_SELECT_TASKLIST_SEARCH = 'SELECT ID, DESCRIPTION, URGENT, PRIVATE, DEADLINE '+
          'FROM TASKLIST WHERE DESCRIPTION LIKE  "%'+searchWord+'%" ';      
    
        return new Promise((resolve,reject) => {            
            db.all(SQL_SELECT_TASKLIST_SEARCH, (err,rows) => {
                this.callBack(resolve,reject,err,rows);                      
            });
        });
    }

}

const db = new sqlite.Database('tasks.db', (err) => {if (err) throw err;})

async function deleteTaskList() {
    const SQL_DELETE = 'DELETE FROM TASKLIST';

    return new Promise((resolve,reject) => {
        db.run(SQL_DELETE, (err) => {
            if (err)
                reject(err);
            else
                resolve(true);
        } )
    } )
}

async function insertNewTask(id, desc, urgent, isPrivate, deadline) {
    const SQL_INSERT = 'INSERT INTO TASKLIST '+
      '(ID, DESCRIPTION, URGENT, PRIVATE, DEADLINE) '+
      'VALUES (?, ?, ?, ?, ?)';

    return new Promise((resolve,reject) => {
        db.run(SQL_INSERT, [id, desc, urgent, isPrivate, deadline], (err) => {
            if (err)
                reject(err);
            else
                resolve(true);
        } )
    });
}

async function main() {
    /* DELETING ALL THE DATA FROM THE DATABASE TO TAKE IT EMPTY EVERY TIME */
    await deleteTaskList();
    /* INSERTING A DATASET OF SAMPLE DATA TO POPULATE THE CLASSES */
    await insertNewTask(3,'phone call',true,false,dayjs('2021-03-08T16:20:00'));
    await insertNewTask(2,'moday lab',false,false,new dayjs('2021-03-16T10:00:00'));
    await insertNewTask(1,'laundry',false,true);
    /* CREATING THE NEW OBJECT tskList*/
    let tskList = new TaskList();
    /* GETTING THE LIST OF TASKS FROM THE DATABASE */
    await tskList.getDBTasks();
    /* GETTING THE LIST OF TASKS WITH A MIMINUM DEADLINE FROM THE DATABASE */
    await tskList.getDBTasksDeadline(dayjs('2021-03-01T10:00:00Z'));
    /* GETTING THE LIST OF TASKS THAT CONTAINS A WORD IN THE DESCRIPTION */
    await tskList.getDBTasksContainingWord("undry");    
}

main();
