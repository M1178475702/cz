class Stack {
    constructor() {
        this.count = 0;
        this.items = {};
    }

    push(element) {
        this.items[this.count] = element;
        this.count++;
    }

    pop() {
        if (this.isEmpty()) {
            return undefined;
        }
        this.count--;
        const result = this.items[this.count];
        delete this.items[this.count];
        return result;
    }

    peek() {
        if (this.isEmpty()) {
            return undefined;
        }
        return this.items[this.count - 1];
    }

    isEmpty() {
        return this.count === 0;
    }

    size() {
        return this.count;
    }

    clear() {
        this.items = {};
        this.count = 0;
    }

    toString() {
        if (this.isEmpty()) {
            return '';
        }
        let objString = `${this.items[0]}`;
        for (let i = 1; i < this.count; i++) {
            objString = `${objString},${this.items[i]}`;
        }
        return objString;
    }
}
function baseConverter(decNumber, base = 18) {
    // 创建 Stack 类
    const remStack = new Stack();
    // 定义一个进制位数，这里设置了 36 位进制，可自定义位数
    const digits = '0123456789EAFGHCDB';
    let number = decNumber;
    let rem;
    let baseString = '';

    while (number > 0) {
        rem = Math.floor(number % base);
        remStack.push(rem);
        number = Math.floor(number / base);
    }

    while (!remStack.isEmpty()) {
        // 对栈中的数字做转化
        baseString += digits[remStack.pop()];
    }

    return baseString;
}



module.exports = baseConverter;
