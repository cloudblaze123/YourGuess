import Worker from "./trainer-worker?worker";

import { NeuralNetwork } from "../neural-network";
import { Game } from "@/game/game";




class TrainerWorkerProvider {
    workers: Worker[] = [];


    onFinished: (trainedNetwork: NeuralNetwork) => void = () => { };
    onAllFinished: () => void = () => { };


    create(network: NeuralNetwork, game: Game, trainTimes: number, trainerName:String, explorationRate:number) {
        const worker = new Worker();
        

        worker.onmessage = (event) => {            
            const { networkJSON } = event.data;
            const networkTrained = NeuralNetwork.fromJSON(networkJSON);

            this._onWorkerFinished(worker, networkTrained);
        };
        
        
        this.workers.push(worker);
        worker.postMessage({
            networkJSON: network.toJSON(),
            gameJSON: game.toJSON(),
            trainTimes,
            trainerName,
            explorationRate,
        });
    }


    _onWorkerFinished(worker: Worker, network: NeuralNetwork) {
        this.onFinished(network)
        
        this.workers = this.workers.filter((w) => w !== worker);
        if (this.workers.length === 0) {
            this.onAllFinished();
        }
        
        worker.terminate();

        console.log("Worker finished");
        console.log("remaining workers: ", this.workers.length);
    }

}




export { TrainerWorkerProvider }