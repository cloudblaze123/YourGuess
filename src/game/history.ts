import { Result } from "./game";


class History {
    history: { guess: string, result: Result }[] = [];

    add(guess: string, result: Result) {
        this.history.push({ guess, result });
    }

    getHistory() {
        return this.history;
    }
}


class HistoryV2 {
    history: { guess: string, result: Result, reversal: boolean }[] = [];

    add(guess: string, result: Result, reversal: boolean) {
        this.history.push({ guess, result, reversal });
    }

    getHistory() {
        return this.history;
    }
}


export { History, HistoryV2 };