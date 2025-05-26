import { Agent } from "./agent";
import { GuessAction, ReverseResultAction } from "@/game/action";


class HumanAgent extends Agent {
    guess(guessNum: number){
        this.next(new GuessAction(guessNum));
    }

    reverse(toReverse: boolean){
        this.next(new ReverseResultAction(toReverse));
    }
}


export { HumanAgent }