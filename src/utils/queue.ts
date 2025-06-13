class FixedSizeQueue {
    maxSize: number; // 队列的最大容量
    queue: any[]; // 存储队列元素的数组

    constructor(maxSize: number) {
        this.maxSize = maxSize; // 队列的最大容量
        this.queue = []; // 存储队列元素的数组
    }

    // 添加元素到队列
    enqueue(item: any) {
        if (this.queue.length >= this.maxSize) {
            // 如果队列已满，则移除队列的第一个元素
            this.queue.shift();
        }
        // 将新元素添加到队列的末尾
        this.queue.push(item);
    }

    // 从队列中移除并返回第一个元素
    dequeue() {
        if (this.queue.length === 0) {
            // 如果队列为空，则返回 undefined 或者抛出错误
            return undefined;
        }
        return this.queue.shift(); // 移除并返回队列的第一个元素
    }

    // 查看队列的第一个元素
    peek() {
        if (this.queue.length === 0) {
            // 如果队列为空，则返回 undefined 或者抛出错误
            return undefined;
        }
        return this.queue[0]; // 返回队列的第一个元素
    }

    // 获取队列的大小（当前存储的元素数量）
    getSize() {
        return this.queue.length;
    }

    // 检查队列是否已满
    isFull() {
        return this.queue.length === this.maxSize;
    }

    // 检查队列是否为空
    isEmpty() {
        return this.queue.length === 0;
    }

    // 打印队列中的所有元素
    print() {
        console.log(this.queue);
    }
}




export { FixedSizeQueue }