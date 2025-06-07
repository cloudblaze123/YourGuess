import { Agent } from "./agent";
import { GuessAction } from "@/game/action";


/**
 * 随机猜数的代理
 * 猜的时候只会猜没猜过的数字
 */
class SkipGuessedRandomAgent extends Agent {
    max: number = 100
    min: number = 0

    guessed = new Set();

    constructor() {
        super();

        this.OnGameStarting = () => {
            this.max = this.gameInstance!.max;
            this.min = this.gameInstance!.min;
            this.guessed.clear();
        }

        this.onUpdate = () => {
            let guess = -1;

            const range = this.max - this.min + 1;
            
            do {
                guess = Math.round(Math.random() * range + this.min);
            } while (this.guessed.has(guess));

            this.guessed.add(guess);

            this.next(new GuessAction(guess));
        }
    }
}


export { SkipGuessedRandomAgent }