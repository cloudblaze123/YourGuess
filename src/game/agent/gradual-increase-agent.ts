import { Agent } from "./agent";
import { GuessAction } from "@/game/action";


/**
 * 逐一增加猜数的Agent
 */
class GradualIncreaseAgent extends Agent {
    lastGuess = -1;

    constructor() {
        super();
        this.OnGameStarting = () => {
            this.lastGuess = -1;
        }

        this.onUpdate = () => {
            this.lastGuess++;
            const guess = this.lastGuess;
            this.next(new GuessAction(guess));
        }
    }
}


export { GradualIncreaseAgent }