

enum Result {
    TOO_SMALL = -1,
    CORRECT,
    TOO_BIG,
}


function getResultMessage(result: Result): string {
    switch (result) {
        case Result.CORRECT:
            return "Correct";
        case Result.TOO_SMALL:
            return "Too small";
        case Result.TOO_BIG:
            return "Too big";
        default:
            return "Invalid result.";
    }
}


type GameOptions = {
    min?: number,
    max?: number,
    target?: number,
    maxGuessCount?: number,
}


class Game{
    random:() => number = Math.random;
    target:number = -1;

    guessNum:number = -1;
    reversal:boolean = false;

    min:number = 1;
    max:number = 100;

    // 最大猜数次数，达到此次数后游戏结束
    maxGuessCount:number = 500;

    history:{ guess:number, result:Result }[] = [];

    onUpdate: () => void = () => {};


    initGame():void{
        this.target = this._generateRandomNumber(this.min, this.max);
        this.history.length = 0;
    }


    _generateRandomNumber(min: number, max: number): number {
        return Math.floor(this.random() * (max - min + 1)) + min;
    }


    next(){
        this.guess(this.guessNum);
        this.onUpdate();
    }


    guess(number:number):Result{
        const result = this._guess(number);
        this.history.push({guess:number, result:result});
        return result;
    }


    _guess(number:number):Result{
        if(number === this.target){
            return Result.CORRECT;
        }

        if(number > this.target){
            return Result.TOO_BIG;
        }else{
            return Result.TOO_SMALL;
        }
    }


    isGameOver():boolean{
        if(this.history.length >= this.maxGuessCount){
            console.log("max guess count reached");
            return true;
        }

        if(this.history.length > 0){
            const lastResult = this.history[this.history.length - 1].result;
            if(lastResult === Result.CORRECT){
                return true;
            }
        }
        return false;
    }


    getRounds():number{
        return this.history.length;
    }


    getLastResult(): Result | null{
        if (this.history.length <= 0) {
            return null;
        }
        return this.history[this.history.length - 1].result;
    }


    getOptions(): GameOptions {
        return {
            min: this.min,
            max: this.max,
            target: this.target,
            maxGuessCount: this.maxGuessCount,
        };
    }


    setOptions(options: GameOptions): void {
        const { min, max, target, maxGuessCount } = options;
        min && (this.min = min);
        max && (this.max = max);
        target && (this.target = target);
        maxGuessCount && (this.maxGuessCount = maxGuessCount);
    }




    toJSON():any{
        return {
            target: this.target,
            guessNum: this.guessNum,
            reversal: this.reversal,
            min: this.min,
            max: this.max,
            maxGuessCount: this.maxGuessCount,
            history: this.history,
        };
    }


    static fromJSON(json:any): Game {
        const game = new Game();
        game.target = json.target;
        game.guessNum = json.guessNum;
        game.reversal = json.reversal;
        game.min = json.min;
        game.max = json.max;
        game.maxGuessCount = json.maxGuessCount;
        game.history = json.history;
        return game;
    }
}




export {
    Game,
    type GameOptions,
    Result,
    getResultMessage,
}