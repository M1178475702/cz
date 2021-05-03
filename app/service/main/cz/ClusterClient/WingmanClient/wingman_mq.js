const Base = require('sdk-base');
const Queue = require('./queue');
const log = console.log;
/**
 * 生产者向队列插入任务，指定一个事件名once（事件名是否会重复？）事件名->通信标识
 * 当有多个生产者时，任务编号编制为，生产者id + uuid
 * 一个任务应该包含   事件名，任务名，参数
 *
 */


class WingmanScheduler extends Base{
    constructor(options){
        options = options || {};
        super();
        this._options = options;
        this.logger = options.logger;
        this._queue = new Queue();
        this.wingmanManager = null;
        this.runningCount = 0;
        this.maxQueueSize = options.maxQueueSize;
    }

    setWingmanManager(wingmanManager){
        this.wingmanManager  = (wingmanManager);
    }

    /**
     * @description 获取空闲僚机
     * @returns {Wingman}
*/
    getIdleWingman(){
        let target;
        const ids = this.wingmanManager.getAliveWingmanIds();
        for(let id of ids){
            const wingman = this.wingmanManager.getWingman(id);
            if(!wingman.isRunning){
                target = wingman;
                break;
            }
        }
        return target;
    }

    push(task){
        //如果队列已满
        if(!this.isFull()){
            this._queue.enqueue(task);
            this.trySchedule();
        }
        else {
            const error = new Error('The queue is full');
            this.emit(task.flag,error);
        }
    }

    isFull(){
        return this.leftTaskCount >= this.maxQueueSize;
    }

    trySchedule(){
        //TODO  要先判读是否有空闲进程，如果先判断空闲任务，则任务可能会丢失
        const idleWingman = this.getIdleWingman();
        if(!idleWingman) return;
        const task = this.getTask();
        if(!task) return;
        ++this.runningCount;
        //TODO 曾经导致complete注册监听器过多，导致出错
        idleWingman.doTask(task);
        idleWingman.once('complete',(result)=>{
            --this.runningCount;
            this.trySchedule();
            this.emit(task.flag,null,result);
        });
    }

    getTask(){
        if(!this.empty()){
            return this._queue.dequeue();
        }
    }

    empty(){
        return this._queue.empty();
    }

    get leftTaskCount(){
        return this._queue.length;
    }

}

module.exports = WingmanScheduler;
