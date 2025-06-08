import { Game } from "@/game/game";
import { GameState } from "./game-state";
import { normalize } from "@/utils/math";




class TrainData {
    state: number[];
    action: number;
    reward: number;
    done: boolean;

    // 调试用，记录原始猜数
    originGuess?: number;

    constructor(state: number[], action: number, reward: number, done: boolean) {
        this.state = state;
        this.action = action;
        this.reward = reward;
        this.done = done;
    }

    static fromGameState(gameState: GameState, nextGameState: GameState | null, totalReward: number): TrainData {
        const state = gameState.getEncodedState();
        
        let action = 0;
        let normalizedAction: number = 0;
        if (nextGameState) {
            action = nextGameState!.getAction();
            // console.log("action", action);
            // console.log("min", gameState.min);
            // console.log("max", gameState.max);
            normalizedAction = normalize(action, gameState.min, gameState.max);
            // console.log("normalizedAction", normalizedAction);
        }
        
        const reward = totalReward;

        const done = nextGameState ? false : true;
        
        const record = new TrainData(state, normalizedAction, reward, done);
        record.originGuess = action;
        return record;
    }
}




class TrainDataFactory {
    states: GameState[] = [];

    constructor(states: GameState[]) {
        this.states = states;
    }

    static fromGame(game: Game): TrainData[] {
        const states = GameState.parseStatesFromGame(game);
        const factory = new TrainDataFactory(states);
        const data = factory.generateTrainDatas();
        // console.log('states', states);
        // console.log("train data", data);
        return data;
    }

    generateTrainDatas(): TrainData[] {
        const datas: TrainData[] = [];

        const rewards = this._calTotalRewardOfStates();
        // 从结束状态开始，倒序生成训练数据
        for (let i = this.states.length - 1; i >= 0 ; i--) {
            const currentState = this.states[i];
            const nextState = i+1 < this.states.length ? this.states[i+1] : null;
            
            // 当前行动的价值应由下一状态的总奖励来决定
            const reward = i+1 < this.states.length ? rewards[i+1] : 0;

            const data = TrainData.fromGameState(currentState, nextState, reward);
            datas.push(data);
        }
        
        // 将倒序的训练数据反转成正向（按照游戏开始到结束的顺序），以便调试
        return datas.reverse();
    }


    // 当前总奖励 = 当前行动奖励 + 折扣系数 * 未来奖励（下一状态的总奖励）
    // 该方法使用递归计算总奖励
    // 如果需要计算的状态很多，请改用 _calTotalRewardOfStates 方法
    _getTotalReward(currentStateIndex: number, nextStateIndex: number): number {
        if (currentStateIndex >= this.states.length) {
            return 0;
        }
        const currentState = this.states[currentStateIndex];

        const currentReward = this._getStateReward(currentState);
        const futureReward = this._getTotalReward(nextStateIndex, nextStateIndex + 1);
        
        const totalReward = this._calTotalReward(currentReward, futureReward);
        return totalReward;
    }

    // 循环计算每个状态对应的总奖励
    // 相比使用 _getTotalReward 方法，该方法更适合计算大量状态的总奖励
    _calTotalRewardOfStates(): number[] {
        const rewards: number[] = [];

        let currentReward = 0;
        let futureReward = 0;
        let totalReward = 0;
        for (let i = this.states.length - 1; i >= 0 ; i--) {
            const currentState = this.states[i];

            currentReward = this._getStateReward(currentState);
            totalReward = this._calTotalReward(currentReward, futureReward);
            futureReward = totalReward

            rewards.push(totalReward);
        }

        return rewards.reverse();
    }
    
    // 总体奖励理论下限为 -1 / (1 - discount)
    _calTotalReward(currentReward: number, futureReward: number): number {
        const discount = 0.4;
        const totalReward = currentReward + discount * futureReward;
        return totalReward;
    }

    // 计算当前状态的奖励
    // 奖励值为负数
    // 距离目标值越近，奖励越高（越接近 0）
    _getStateReward(state: GameState): number {
        if (state.getIndex() === 0) { // 初始状态无需计算奖励
            return 0;
        }

        let reward = -0.5 * state.getIndex(); // 鼓励模型用尽可能少的次数猜到目标值

        const normalizedTarget = normalize(state.target, state.min, state.max);
        const normalizedGuess = normalize(state.getAction(), state.min, state.max);
        const normalizedDstance = Math.abs(normalizedTarget - normalizedGuess);
        
        reward += -Math.sqrt(normalizedDstance); // 猜测数与目标值的距离越接近0，奖励增长的速度越快

        return reward;
    }
}




export { TrainData, TrainDataFactory };