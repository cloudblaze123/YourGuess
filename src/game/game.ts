

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
    targetNumber:number = -1;
    guessNumber:number = -1;

    min:number = 1;
    max:number = 100;


    initGame():void{
        this.targetNumber = this.generateRandomNumber(this.min, this.max);
    }

    private generateRandomNumber(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    guess(number:number):Result{
        if(number == this.targetNumber){
            return Result.CORRECT;
        }

        if(number > this.targetNumber){
            return Result.TOO_BIG;
        }else{
            return Result.TOO_SMALL;
        }
    }

}



