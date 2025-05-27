

export enum Result {
    TOO_SMALL = -1,
    CORRECT,
    TOO_BIG,
}


export function getResultMessage(result: Result): string {
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



export class Game{
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


    private _generateRandomNumber(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min + 1)) + min;
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


    private _guess(number:number):Result{
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

}



