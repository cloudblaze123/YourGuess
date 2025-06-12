import { Matrix, map } from 'mathjs';




class Activation {
    activate(x: Matrix): Matrix {
        return x;
    }

    derivative(x: Matrix): Matrix {
        return x;
    }
}




class Sigmoid extends Activation {
    activate(x: Matrix): Matrix {
        return map(x, (value) => 1 / (1 + Math.exp(-value)));
    }

    derivative(x: Matrix): Matrix {
        return map(x, (value) => value * (1 - value));
    }
}




class Relu extends Activation {
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
        super();
        this.alpha = alpha;
    }

    activate(x: Matrix): Matrix {
        return map(x, (value) => Math.max(this.alpha * value, value));
    }

    derivative(x: Matrix): Matrix {
        return map(x, (value) => value > 0? 1 : this.alpha);
    }
}




export {
    Activation,
    Sigmoid,
    Relu,
    LeakyRelu
};