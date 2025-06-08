import { Agent } from "./agent/agent";
import { GuessAction, ReverseResultAction, endGameAction } from "./action";
import { Game } from "./game";

import { sleep } from "@/utils/common";
import { Logger } from "@/utils/logger";


const logger = new Logger('GameEnv', true);


class GameEnvironment {
    game: Game;
    attacker: Agent;
    defender: Agent;

    lastAgent: Agent | null = null;


    updateInterval = 0; // ms，游戏每轮更新间隔时间，默认为0，即立即更新
    startDelay = 0; // ms，游戏开始前的延迟时间，方便观察效果


    constructor(game: Game, attacker: Agent, defender: Agent) {
        this.game = game;
        this.attacker = attacker;
        this.defender = defender;
    }


    async start() {
        this.lastAgent = null;

        this._initAgents();
        this.game.initGame();
        logger.log(`Target number is ${this.game.target}`);
        await this.loop();
    }


    _initAgents() {
        this.attacker.gameInstance = this.game;
        this.defender.gameInstance = this.game;
        this.attacker.OnGameStarting()
        this.defender.OnGameStarting()
    }


    async loop() {
        await sleep(this.startDelay)
        while (true) {
            if (this.game.isGameOver()) {
                logger.log("Game over");
                break;
            }


            const agent = this.getAgentToAct();
            await this._update(agent);


            const action = this.lastAgent?.action;
            if (action instanceof endGameAction) {
                logger.log("Game ended by agent");
                break;
            }
            if (action instanceof GuessAction) {
                this.game.guessNum = action.guess;
                logger.log(`Attacker guessed ${action.guess}`);
            }
            if (action instanceof ReverseResultAction) {
                this.game.reversal = action.reverse;
                logger.log(`Defender reversed the result or not:`, action.reverse);
            }


            if (this.lastAgent === this.defender) {
                this.game.next()
            }

            await sleep(this.updateInterval);
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