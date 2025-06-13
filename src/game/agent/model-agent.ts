import { Agent } from "./agent";
import { GuessAction, endGameAction } from "@/game/action";

import { NeuralNetwork } from "@/model/neural-network";
import { GuesserNeuralNetwork } from "@/model/guesser-neural-network/guesser-neural-network";

import { Logger } from "@/utils/logger";


const logger = new Logger("ModelAgent", false);




class ModelAgent extends Agent {
    network?: GuesserNeuralNetwork | null;

    constructor(network: NeuralNetwork | null = null, explorationRate: number = 0.1){
        super();
        this.setNetwork(network, explorationRate);
        this.onUpdate = () => {
            this.guess();
        }
    }

    setNetwork(network: NeuralNetwork | null, explorationRate: number){
        if (network) {
            this.network = new GuesserNeuralNetwork(network, explorationRate);
        } else {
            this.network = null;
        }
    }

    guess(){
        if (!this.network) {
            console.warn("无猜数模型，无法猜数");
            this.next(new endGameAction());
            return;
        }
        // 准备 inputs
        const inputData = GuesserNeuralNetwork.encodeGameState(this.gameInstance!);
        if (!this.network.isInputAffordable(inputData)){
            logger.log("输入过长，无法进行预测");
            this.next(new endGameAction());
            return;
        }
        
        // 将模型输出转换为猜数
        const guessNum = this.network.makeGuess(inputData)

        this.next(new GuessAction(guessNum));
    }
}


export { ModelAgent }