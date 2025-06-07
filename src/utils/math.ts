// 使用 Box-Muller 算法生成正态分布随机数
function boxMullerRandom(mean = 0, stdDev = 1) {
    let u1 = Math.random();
    let u2 = Math.random();
    let z0 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
    // let z1 = Math.sqrt(-2.0 * Math.log(u1)) * Math.sin(2.0 * Math.PI * u2); // 如果需要第二个随机数
    return z0 * stdDev + mean;
}


// 正态分布随机数
function normalRandom(mean = 0, stdDev = 1) {
    return boxMullerRandom(mean, stdDev);
}


// 截断正态分布随机数
function truncatedRandomNormal(mean: number, stdDev: number, lower: number, upper: number) {
    if (lower > upper) {
        throw new Error("Lower bound must be less than or equal to upper bound.");
    }
    while(true) {
        let sample = boxMullerRandom(mean, stdDev);
        if (lower <= sample && sample <= upper) {
            return sample;
        }
    }
}


// 将一个数值标准化到 0-1 之间
function normalize(num: number, min: number, max: number): number {
    if (min > max) {
        throw new Error("Min must be less than or equal to max.");
    }
    if (num < min || num > max) {
        console.warn(`Number ${num} is out of range [${min}, ${max}].`);
        throw new Error("Number is out of range.");
    }

    const range = Math.abs(max - min);
    if (range === 0) {
        return 0;
    }
    const norm = (num - min) / range;
    return norm;
}



export {
    normalRandom,
    truncatedRandomNormal,
    normalize,
}