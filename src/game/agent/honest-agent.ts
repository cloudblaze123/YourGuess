import { Agent } from "./agent";
import { ReverseResultAction } from "@/game/action";


class HonestAgent extends Agent {
    constructor() {
        super();
        this.onUpdate = () => {
            this.next(new ReverseResultAction(false));
        }
    }
}


export { HonestAgent }