const Base = require('sdk-base');
const cp = require('child_process');

class Wingman extends Base {
    constructor(options) {
        options = options || {};
        super({
            initMethod: 'init',
        });
        this._options = options;
        this._options.args = options.args || [];
        this._process = null;
        this._isDied = true;
        this._isRunning = false;
    }

    async init() {
        this._process = cp.fork(this._options.exec, this._options.args, this._options.forkOpt);
        this._isDied = false;
        this._process.on('error',(error)=>{
            this.emit('error',error);
        });
        this._process.on('close',(code)=> {
            this._isDied = true;
            this.emit('close', code);
        });
        this._process.on('exit',(code,signal)=>{
            this._isDied = true;
            this._process.removeAllListeners();
            this.emit('exit',code,signal);
        });
        this._process.on('message',this.onMessage.bind(this));
    }

    doTask(task){
        this._isRunning = true;
        //TODO  应该是异步的呀
        this._process.send(task);
    }

    onMessage(result){
        this._isRunning = false;
        this.emit('complete',result);
    }

    get process(){
        if(this.isDied)
            throw new Error('The process has be killed');
        return this._process;
    }

    get isDied(){
        return this._isDied;
    }

    get isRunning(){
        return this._isRunning;
    }

    kill(){
        this._process.removeAllListeners();
        this._process.kill('SIGKILL');
        this._isDied = true;
    }
}

module.exports = Wingman;

module.exports.generateWingman = async function(options){
    let execArgv = [];
    if(/insepect/.test(process.execArgv))
        execArgv = ['--inspect-brk=55362','--inspect-port=5799'];
    const wingman = new Wingman({
        exec: options.exec,
        args:[],
        forkOpt:{
            execArgv: execArgv
        }
    });
    wingman.on('wingman_error',(error)=>{
        throw error;
    });
    await wingman.ready();
    return wingman;
};
