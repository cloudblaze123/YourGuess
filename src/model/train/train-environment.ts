import { NeuralNetwork } from "../neural-network";
import { Trainer } from "./trainer";

import { Game } from "@/game/game";




class TrainEnvironment {
    network: NeuralNetwork;
    game: Game;
    trainer: Trainer;


    onUpdate: (currentTrainTimes: number) => void = () => { };

    
    constructor(network: NeuralNetwork, game: Game) {
        this.network = network;
        this.game = game;
        
        this.trainer = new Trainer(network, game);
        this.trainer.onUpdate = (currentTrainTimes) => {
            this.onUpdate(currentTrainTimes);
        }
    }


    async start(trainTimes: number): Promise<void> {
        await this.trainer.start(trainTimes);
    }

}


export { TrainEnvironment }