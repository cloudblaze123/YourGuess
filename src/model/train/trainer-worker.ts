import { TrainerFactory } from "./trainer-factory";


import { NeuralNetwork } from "../neural-network";
import { Game } from "@/game/game";




self.addEventListener("message", async (event) => {
    const { networkJSON, gameJSON, trainTimes, trainerName, exploraionRate } = event.data;

    const network = NeuralNetwork.fromJSON(networkJSON);
    const game = Game.fromJSON(gameJSON);
    const trainer = TrainerFactory.create(network, game, trainerName);

    await trainer.start(trainTimes, exploraionRate);
    

    postMessage({
        networkJSON: network.toJSON(),
    });
});


