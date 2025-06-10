import { GuesserNeuralNetwork } from "@/model/guesser-neural-network/guesser-neural-network";
import { NeuralNetwork } from "../neural-network";


import { GameEnvironment } from "@/game/game-environment";
import { Game } from "@/game/game";
import { ModelAgent } from "@/game/agent/model-agent";
import { HonestAgent } from "@/game/agent/honest-agent";




class Trainer {
    network: NeuralNetwork;
    game: Game;


    onUpdate: (currentTrainTimes: number) => void = () => { };

    
    constructor(network: NeuralNetwork, game: Game) {
        this.network = network;
        this.game = game;
    }


    async start(trainTimes: number): Promise<void> {
        const guesserNetwork = new GuesserNeuralNetwork(this.network);

        const game = this.game;
        const attacker = new ModelAgent(this.network);
        const defender = new HonestAgent();
        const environment = new GameEnvironment(game, attacker, defender);
        environment.enableLog(false);

        for (let i = 0; i < trainTimes; i++) {
            await environment.start();
            guesserNetwork.trainByGame(game);
            this.onUpdate(i+1);
        }
    }

}


export { Trainer }