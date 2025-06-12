import { Trainer } from './trainer';
import { CrossEntropyTrainer } from './cross-entropy-trainer';

import { Game } from '@/game/game';
import { NeuralNetwork } from '../neural-network';


type TrainerType = '' | 'cross-entropy';

class TrainerFactory {
    static create(network: NeuralNetwork, game: Game, name: string): Trainer {
        switch (name) {
            case '':
                return new Trainer(network, game);
            case 'cross-entropy':
                return new CrossEntropyTrainer(network, game);
            default:
                throw new Error(`Trainer ${name} not found`);
        }
    }
}


export { TrainerFactory, type TrainerType }