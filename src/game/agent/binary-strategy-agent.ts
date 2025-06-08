import { Agent } from "./agent";
import { GuessAction, endGameAction } from "@/game/action";

import { Result } from "@/game/game";




/**
 * 使用二分法猜数的Agent
 */
class BinaryStrategyAgent extends Agent {
    min: number = 100;
    max: number = 1;
    lastGuess: number = 0;


    constructor() {
        super();
        this.OnGameStarting = () => {
            this.min = this.gameInstance!.min;
            this.max = this.gameInstance!.max;
        }

        this.onUpdate = () => {
            if (this.max <= this.min) {
                // 如果范围缩小到只有一个数字，而游戏仍然没有结束，可能是游戏出错，需要结束游戏
                console.warn(`invalid range [${this.min}, ${this.max}]`)
                this.next(new endGameAction());
                return;
            }

            this.updateRange();
            this.lastGuess = this.makeGuess();
            this.next(new GuessAction(this.lastGuess));
        }
    }


    updateRange() {
        if (this.gameInstance!.history.length === 0) {
            return;
        }

        const lastRecord = this.gameInstance!.history[this.gameInstance!.history.length - 1]
        const result = lastRecord.result;

        if (result === Result.TOO_BIG) {
            this.max = this.lastGuess - 1;
        } else if (result === Result.TOO_SMALL) {
            this.min = this.lastGuess + 1;
        }
    }


    makeGuess(): number {
        const range = this.max - this.min;
        const guess = Math.floor(range / 2) + this.min;
        return guess;
    }
}


export { BinaryStrategyAgent }