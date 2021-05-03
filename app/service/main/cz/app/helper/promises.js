class Promises {
    constructor(){
        this.container = [];
    }

    static getPromises(){
        return new Promises();
    }

    push(promise){
        this.container.push(promise);
    }

    async execute(){
        const results =  await Promise.all(this.container);
        this.reset();
        return results;
    }

    reset(){
        this.container = [];
    }
}

module.exports = Promises;
