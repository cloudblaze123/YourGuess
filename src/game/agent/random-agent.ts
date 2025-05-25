import { Agent } from "./agent";
import { GuessAction } from "@/game/action";


class RandomAgent extends Agent {
    constructor() {
        super();
        this.onUpdate = () => {
            const guess = Math.floor(Math.random() * 100);
            this.next(new GuessAction(guess));
        }
    }
}


export { RandomAgent }