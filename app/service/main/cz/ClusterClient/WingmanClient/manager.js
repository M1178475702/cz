'use strict';

const EventEmitter = require('events');

// worker manager to record agent and worker forked by egg-cluster
// can do some check stuff here to monitor the healthy
class Manager extends EventEmitter {
    constructor() {
        super();
        this.wingmans = new Map();
    }

    setWingman(wingman) {
        this.wingmans.set(wingman.process.pid, wingman);
    }

    getWingman(pid) {
        return this.wingmans.get(pid);
    }

    //process 已被杀死
    deleteWingman(pid) {
        this.wingmans.delete(pid)
    }

    listWingmanIds() {
        return Array.from(this.wingmans.keys());
    }

    getAliveWingmanIds() {
        const keys = [];
        for (const id of this.wingmans.keys()) {
            if (!this.getWingman(id).isDied) {
                keys.push(id);
            }
        }
        return keys;
    }

    get count() {
        return this.getAliveWingmanIds().length;
    }

    // check agent and worker must both alive
    // if exception appear 3 times, emit an exception event
    startCheck() {
        this.exception = 0;
        const count = this.count;
        this.timer = setInterval(() => {

            if (count) {
                this.exception = 0;
                return;
            }
            this.exception++;
            if (this.exception >= 3) {
                this.emit('exception', count);
                clearInterval(this.timer);
            }
        }, 10000);
    }

}

module.exports = Manager;
