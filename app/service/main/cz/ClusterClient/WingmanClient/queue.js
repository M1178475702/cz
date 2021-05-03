class EmptyError extends Error {
    constructor(msg) {
        super(msg);
        this.name = EmptyError;
    }
}


class Queue {
    constructor(list) {
        if (list) {
            if (list instanceof Array)
                this.container = list;
            else
                throw TypeError('list must be array!');
        } else
            this.container = [];
    }

    enqueue(ele) {
        this.container.push(ele);
    }

    dequeue() {
        if (this.empty())
            throw new EmptyError('The queue is empty');
        return this.container.shift();
    }

    empty() {
        return this.container.length === 0;
    }

    get length() {
        return this.container.length;
    }

}

module.exports = Queue;

