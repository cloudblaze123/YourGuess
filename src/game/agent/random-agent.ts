import { Agent } from "./agent";
import { GuessAction } from "@/game/action";


class RandomAgent extends Agent {
    max: number = 100
    min: number = 0

    constructor() {
        super();
        this.OnGameStarting = () => {
            this.max = this.gameInstance!.max;
            this.min = this.gameInstance!.min;
        }
        this.onUpdate = () => {
            const range = this.max - this.min + 1;
            const guess = Math.round(Math.random() * range + this.min);
            this.next(new GuessAction(guess));
        }
    }
}


export { RandomAgent }