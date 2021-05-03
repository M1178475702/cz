
//建立通信机制
class TaskServer {
    constructor(props) {
        this.service = new Map();
    }


    addService(serviceName,handler){
        if( this.service.get(serviceName))
            throw new Error(`Service ${serviceName} has been exist`);
        this.service.set(serviceName,handler);
    }

    getService(serviceName){
        const service = this.service.get(serviceName);
        if(!service)
            throw new Error(`Service ${serviceName} don't exist`);
        return service;
    }

    getServiceNameList(){
        return Array.from(this.service.keys());
    }

    doService(task){
        const service  = this.getService(task.name);
        let result;
        if(typeof service === 'function'){
            result =  service(...task.args);
        }
        else {
            result = service;
        }
        return result;
    }

}

module.exports = TaskServer;







