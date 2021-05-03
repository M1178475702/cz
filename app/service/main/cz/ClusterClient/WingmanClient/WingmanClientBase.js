const Base = require('sdk-base');
const {generateWingman} = require('./Wingman');
const WingmanScheduler = require('./wingman_mq');
const WingmanManager = require('./manager');
const uuid = require('uuid/v4');
const ConsoleLogger = require('egg-logger').EggConsoleLogger;

class Task {
    constructor(flag, name, args) {
        this.flag = flag;
        this.name = name;
        this.args = args;
    }
}

/**
 * 1.生成任务队列
 * 2.生成wingman
 * 3.给任务队列设置wingman
 * 4.给外部暴露doTask接口
 *
 * 5.尝试解耦wingman与任务队列（使用事件）
 * 6.尝试complete不使用once使用on
 */
class WingmanClientBase extends Base {
    constructor(options) {
        super({
            initMethod: 'init',
        });
        options.logger = options.logger || new ConsoleLogger({level: process.env.EGG_MASTER_LOGGER_LEVEL || 'INFO'});
        this._options = options;
        this.logger = options.logger;
        this.wingmanManager = new WingmanManager(options);
        this.wingmanScheduler = new WingmanScheduler(options);
        this.name = 'WingmanClient';
        this.startFailedWingmans = 0;
        this.canWork = true;
        this.isExitWhenCantWork = this._options.isExitWhenCantWork || true;

        this.wingmanManager.on('exception', (count) => {
            const err = new Error(`[master] ${count} wingman(s) alive, exit to avoid unknown state`);
            err.name = 'WingmanClientExceptionError';
            err.count = count;
            this.logger.error(err);
            process.exit(1);
        });
        this.wingmanScheduler.setWingmanManager(this.wingmanManager);
    }

    /**
     * 启动逻辑
     */
    async init() {
        //构建子进程
        const count = this._options.count = this._options.count || 1;
        for (let i = 0; i < count; ++i) {
            try {
                const wingman = await generateWingman(this._options);
                this.wingmanManager.setWingman(wingman);
                wingman.on('exit', async (code, signal) => {
                    await this.onWingmanExit(wingman, code, signal);
                })
            }
            catch (error) {
                ++this.startFailedWingmans;
            }
        }
        if (this.wingmanManager.count === 0)
            this.canWork = false;

        if (!this.canWork && this.isExitWhenCantWork) {
            this.logger.error('[WingmanClient]  start failed, failed wingman count %s',this.startFailedWingmans);
            process.exit(1);
        } else {
            this.wingmanManager.startCheck();
            this.canWork = true;
            this.logger.info('[WingmanClient]  start success, start wingman count %s',this.wingmanManager.count);
        }
    }

    async scheduleTask(taskName, args) {
        let respond;
        try{
            if(!this.canWork){
                throw new Error('[WingmanClient] Can\'t work because there is no available wingman');
            }
            const task = this.wrapTask(taskName, args);
            const result = await this._scheduleTask(task);
            respond = {
                error: null,
                result: result
            }
        }
        catch (error) {
            respond = {
                error: error,
                result: null
            }
        }
        return respond;
    }

    _scheduleTask(task){
        return new Promise((resolve, reject) => {
            if(this.wingmanScheduler.isFull())
                reject(new Error('The queue is full'));
            else{
                this.wingmanScheduler.once(task.flag, (error, result) => {
                    if (error)
                        reject(error);
                    else
                        resolve(result);
                });
                this.wingmanScheduler.push(task);
            }
        });
    }

    wrapTask(taskName, args) {
        const flag = this.generateTaskFlag(taskName);
        return new Task(flag, taskName, args);
    }

    generateTaskFlag(taskName) {
        return `${this.name}-${taskName}-${uuid('egg.org')}`
    }

    async onWingmanExit(wingman, code, signal) {
        wingman.removeAllListeners();
        this.wingmanManager.deleteWingman(wingman.process.pid);

        // send message to agent with alive workers
        if (this.wingmanManager.count === 0) {
            await this.ready(false);
            if (!this.isRestart && this.isExitWhenCantWork) {
                process.exit(1);
            }
        } else {
            this.logger.error('[WingmanClient]  wingman#%s exit code: %s, signal: %s, left wingman %s',
                code, signal, this.wingmanManager.count)
        }
    }

    async wingmanCount(){
        return this.wingmanManager.count;
    }

    async restart(){
        this.logger.info('[WingmanClient]  restart');
        this.isRestart = true;
        if(this.canWork){
            await this.clearUpWingman();
        }
        await this.init();
        this.isRestart = false;
    }

    async isCanWork(){
        return this.canWork;
    }

    async runningCount(){
        return this.wingmanScheduler.runningCount;
    }

    async leftTaskCount(){
        return this.wingmanScheduler.leftTaskCount;
    }

    async clearUpWingman(){
        this.logger.info('[WingmanClient]  clear up all wingman');
        const ids = this.wingmanManager.getAliveWingmanIds();
        for(const id of ids){
            const wingman =  this.wingmanManager.getWingman(id);
            wingman.kill();
        }
    }

    subscribe(reg, listener) {
        //
    }

    publish(reg) {
        //
    }
}

module.exports = WingmanClientBase;
