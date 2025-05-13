import { Game } from './game';

const game = new Game();
game.initGame();

const guess = 50;
const result = game.guess(guess);

console.log(result);
console.log(`The target number is ${game.targetNumber}`);