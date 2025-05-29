import { Result } from "./game";
import { Game } from "./game";


class GameRecord {
    max: number = -1;
    min: number = -1;

    history: { guess: number, result: Result }[] = [];


    add(guess: number, result: Result) {
        this.history.push({ guess, result });
    }

    
    static readFromGame(game: Game) {
        const record = new GameRecord();

        record.max = game.max;
        record.min = game.min;
        record.history = game.history;
        
        return record
    }
}


export { GameRecord };