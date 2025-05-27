import { Agent } from "./agent";
import { GuessAction } from "@/game/action";


/**
 * 随机猜数的代理
 * 猜的时候只会猜没猜过的数字
 */
class SkipGuessedRandomAgent extends Agent {
    guessed = new Set();

    constructor() {
        super();

        this.OnGameStarting = () => {
            this.guessed.clear();
        }

        this.onUpdate = () => {
            let guess = -1;
            
            do {
                guess = Math.floor(Math.random() * 100);
            } while (this.guessed.has(guess));
            // if(this.guessed.has(guess)){
            //     console.warn("重复的数字:", guess);
            // }
            this.guessed.add(guess);

            this.next(new GuessAction(guess));
        }
    }
}


export { SkipGuessedRandomAgent }