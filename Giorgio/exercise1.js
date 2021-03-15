/* ESERCIZIO 1 */
'use strict';
const dayjs = require('dayjs');

function Task(id, desc, urgent = false, isPrivate = false, deadline = 0 ) {    
    this.id=id;
    this.desc=desc;
    this.urgent=urgent;
    this.isPrivate=isPrivate;
    this.deadline=deadline    

    this.toString = () => {
        let deadlineStr='<not defined>'
        if (deadline!=0)
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
}

let tsList = new TaskList();
tsList.add(new Task(3,'phone call',true,false,dayjs('2021-03-08T16:20:00')));
tsList.add(new Task(2,'moday lab',false,false,new dayjs('2021-03-16T10:00:00')));
tsList.add(new Task(1,'laundry',false,true));
tsList.sortAndPrint();
tsList.filterAndPrint();




