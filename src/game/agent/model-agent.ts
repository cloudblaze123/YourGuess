import { Agent } from "./agent";
import { GuessAction, endGameAction } from "@/game/action";

import { NeuralNetwork } from "@/model/neural-network";
import { GuesserNeuralNetwork } from "@/model/guesser-neural-network/guesser-neural-network";
class ModelAgent extends Agent {
    network: GuesserNeuralNetwork;
    constructor(network: NeuralNetwork){
        super();
        this.network = new GuesserNeuralNetwork(network);
        this.onUpdate = () => {
            this.guess();
        }
    }

    guess(){
        // 准备 inputs
        const inputData = GuesserNeuralNetwork.encodeGameState(this.gameInstance!);
        if (!this.network.isInputAffordable(inputData)){
            console.log("输入过长，无法进行预测");
            this.next(new endGameAction());
            return;
        }
        
        // 将模型输出转换为猜数
        const guessNum = this.network.makeGuess(inputData)

        this.next(new GuessAction(guessNum));
    }
}


export { ModelAgent }