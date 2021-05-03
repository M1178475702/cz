const TaskServer =require('./TaskServer');
const tasks = require('./task');
const taskServer = new TaskServer();

function InitService() {
    const keys = Object.keys(tasks);
    for(const key of  keys){
        taskServer.addService(key,tasks[key])
    }
    process.on('message',async (task)=>{
        process.send(await taskServer.doService(task));
    });
}

InitService();


