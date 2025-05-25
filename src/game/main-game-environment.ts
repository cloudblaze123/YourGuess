import { GameEnvironment } from './game-environment';
import { Game } from './game';
import { RandomAgent } from './agent/random-agent';
import { HonestAgent } from './agent/honest-agent';



const game = new Game();
const attacker = new RandomAgent();
const defender = new HonestAgent();
const gameEnv = new GameEnvironment(game, attacker, defender);

gameEnv.start();