class Action {}


class NoneAction extends Action {}


class GuessAction extends Action {
    guess: number;
    constructor(guess: number) {
        super();
        this.guess = guess;
    }
}


class ReverseResultAction extends Action {
    reverse:boolean;
    constructor(reverse:boolean) {
        super();
        this.reverse = reverse;
    }
}



export {
    Action,
    NoneAction,
    GuessAction,
    ReverseResultAction
};