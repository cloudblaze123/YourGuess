import { Agent } from "./agent";
import { GuessAction } from "@/game/action";


/**
 * 逐一减少猜数的Agent
 */
class GradualDecreaseAgent extends Agent {
    lastGuess = -1;

    constructor() {
        super();
        this.OnGameStarting = () => {
            const max = this.gameInstance!.max;
            this.lastGuess = max + 1;
        }

        this.onUpdate = () => {
            this.lastGuess--;
            const guess = this.lastGuess;
            this.next(new GuessAction(guess));
        }
    }
}


export { GradualDecreaseAgent }