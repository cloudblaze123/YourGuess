import { Game, Result } from "@/game/game";
import { normalize } from "@/utils/math";




class GameState {
    min: number;
    max: number;
    target: number;
    history: { guess: number, result: Result }[];

    constructor(min: number, max: number, target: number,history: { guess: number, result: Result }[]) {
        if (min > max) {
            throw new Error("min should not be greater than max");
        }
        this.min = min;
        this.max = max;
        this.target = target;
        this.history = history;
    }

    getEncodedState(): number[] {
        const normalizeGuess = (g: number) => normalize(g, this.min, this.max);
        const state = this.history.map(h => [normalizeGuess(h.guess), h.result]).flat();
        return state;
    }

    getAction(): number {
        if (this.history.length === 0) {
            return 0;
        }
        const action = this.history[this.history.length - 1].guess;
        return action;
    }


    getIndex(): number {
        return this.history.length;
    }


    static fromGame(game: Game): GameState {
        const min = game.min;
        const max = game.max;
        const target = game.target;
        const history = game.history;
        return new GameState(min, max, target, history);;
    }

    // 从游戏实例中解析出所有历史状态
    static parseStatesFromGame(game: Game): GameState[] {
        const states: GameState[] = [];
        
        const fullHistory = game.history;
        // 游戏状态个数比游戏历史记录多 1
        // 因为游戏状态需要包含游戏的初始状态，即尚未猜数的状态，但游戏历史记录不需要，所以前者比后者多 1
        // 例如猜数 1 次，历史记录个数为 1，则游戏状态个数为 2 （开始时的猜数状态和猜数后的状态）
        for (let i = 0; i <= fullHistory.length; i++) {
            const history = fullHistory.slice(0, i);
            const state = new GameState(game.min, game.max, game.target, history);
            states.push(state);
        }

        return states;
    }
}




export { GameState };