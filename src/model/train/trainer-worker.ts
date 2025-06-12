import { Trainer } from "./trainer";

import { NeuralNetwork } from "../neural-network";
import { Game } from "@/game/game";




self.addEventListener("message", async (event) => {
    const { networkJSON, gameJSON, trainTimes } = event.data;

    const network = NeuralNetwork.fromJSON(networkJSON);
    const game = Game.fromJSON(gameJSON);
    const trainer = new Trainer(network, game);


    await trainer.start(trainTimes);
    

    postMessage({
        networkJSON: network.toJSON(),
    });
});


