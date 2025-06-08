class Logger {
    name: string
    enabled: boolean
    detailMode: boolean // 开启后会在控制台输出调用函数的位置

    /**
     * @param name 日志名称，可选
     * @param enabled 是否启用日志，默认启用
     * @param detailMode 是否开启详细模式，开启后会在控制台输出调用函数的位置，默认关闭
     */
    constructor(name: string = '', enabled: boolean = true, detailMode: boolean = false) {
        this.name = name;
        this.enabled = enabled;
        this.detailMode = detailMode;
    }
    

    log(...params: any[]) {
        if (!this.enabled) {
            return;
        }


        let prefix = '';
    
        if (this.name) {
            prefix += `[${this.name}]`;
        }
        
        if (this.detailMode) {
            const stack = new Error().stack
            if (stack) {
                const caller = stack.split('\n')[2].trim();
                prefix += ` ${caller}\n`;
            }
        }

    
        let bakedParams = [];
        if (prefix) {
            bakedParams.push(prefix);
        }
        bakedParams.push(...params);

        
        console.log(...bakedParams);
    }

}

export { Logger }