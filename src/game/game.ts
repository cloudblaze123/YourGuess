

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

    history:{ guess:number, result:Result }[] = [];


    initGame():void{
        this.target = this._generateRandomNumber(this.min, this.max);
        this.history.length = 0;
    }


    private _generateRandomNumber(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }


    next(){
        this.guess(this.guessNum);
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

}



