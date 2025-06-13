import { Matrix, map } from 'mathjs';


type ActivationType = 'identity' |'sigmoid' |'relu' | 'leakyrelu' | 'truncatelinear';


class Activation {
    type: ActivationType;

    constructor(type: ActivationType) {
        this.type = type;
    }

    activate(x: Matrix): Matrix {
        return x;
    }

    derivative(x: Matrix): Matrix {
        return x;
    }


    toJSON() {
        return {
            type: this.type
        };
    }


    static fromJSON(json: any): Activation {
        return Activation.get(json.type);
    }


    copy(): Activation {
        return Activation.get(this.type);
    }


    static get(name: string): Activation {
        switch (name) {
            case'identity':
                return new Identity();
            case'sigmoid':
                return new Sigmoid();
            case'relu':
                return new Relu();
            case 'leakyrelu':
                return new LeakyRelu();
            case 'truncatelinear':
                return new TruncateLinear();
            default:
                throw new Error(`Activation function ${name} not found.`);
        }
    }
}




class Identity extends Activation {
    constructor() {
        super('identity');
    }

    activate(x: Matrix): Matrix {
        return x;
    }

    derivative(x: Matrix): Matrix {
        return map(x, (_value) => 1);
    }
}




class Sigmoid extends Activation {
    constructor() {
        super('sigmoid');
    }

    activate(x: Matrix): Matrix {
        return map(x, (value) => 1 / (1 + Math.exp(-value)));
    }

    derivative(x: Matrix): Matrix {
        return map(x, (value) => value * (1 - value));
    }
}




class Relu extends Activation {
    constructor() {
        super('relu');
    }

    activate(x: Matrix): Matrix {
        return map(x, (value) => Math.max(0, value));
    }

    derivative(x: Matrix): Matrix {
        return map(x, (value) => value > 0? 1 : 0);
    }
}




class LeakyRelu extends Activation {
    alpha: number;

    constructor(alpha: number = 0.01) {
        super('leakyrelu');
        this.alpha = alpha;
    }

    activate(x: Matrix): Matrix {
        return map(x, (value) => Math.max(this.alpha * value, value));
    }

    derivative(x: Matrix): Matrix {
        return map(x, (value) => value > 0? 1 : this.alpha);
    }
}




class TruncateLinear extends Activation {
    min: number;
    max: number;

    constructor(min: number = 0, max: number = 1) {
        super('truncatelinear');
        this.min = min;
        this.max = max;
    }

    activate(x: Matrix): Matrix {
        return map(x, (value) => Math.max(this.min, Math.min(value, this.max)));
    }

    derivative(x: Matrix): Matrix {
        return map(x, (value) => this.min <= value && value <= this.max? 1 : 0);
    }
}




export {
    type ActivationType,
    Activation,
    Identity,
    Sigmoid,
    Relu,
    LeakyRelu,
    TruncateLinear
};