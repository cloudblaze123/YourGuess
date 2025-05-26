import { Agent } from "./agent/agent";
import { GuessAction, ReverseResultAction } from "./action";
import { Game } from "./game";


class GameEnvironment {
    game: Game;
    attacker: Agent;
    defender: Agent;

    lastAgent: Agent | null = null;


    constructor(game: Game, attacker: Agent, defender: Agent) {
        this.game = game;
        this.attacker = attacker;
        this.defender = defender;
    }


    start() {
        this.lastAgent = null;

        this.game.initGame();
        console.log(`Target number is ${this.game.target}`);
        this.loop();
    }


    async loop() {
        while (true) {
            if (this.game.isGameOver()) {
                console.log("Game over");
                break;
            }


            const agent = this.getAgentToAct();
            await this._update(agent);


            const action = this.lastAgent?.action;
            if (action instanceof GuessAction) {
                this.game.guessNum = action.guess;
                console.log(`Attacker guessed ${action.guess}`);
            }
            if (action instanceof ReverseResultAction) {
                this.game.reversal = action.reverse;
                console.log(`Defender reversed the result or not:`, action.reverse);
            }


            if (this.lastAgent === this.defender) {
                this.game.next()
            }
        }
    }


    async _update(agent: Agent) {
        this.lastAgent = agent;
        await agent.update();
    }


    getAgentToAct(): Agent {
        // 如果刚开始，则攻击方（猜数方）先行动
        if (!this.lastAgent){
            return this.attacker;
        }

        if (this.isAttackerTurn()) {
            return this.attacker;
        }
        return this.defender;
    }


    isAttackerTurn(): boolean {
        return this.lastAgent === this.defender;
    }

    isDefenderTurn(): boolean {
        return this.lastAgent === this.attacker;
    }
}




export { GameEnvironment }