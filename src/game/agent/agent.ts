import { Action, NoneAction } from "@/game/action";
import type { Game } from "../game";



// 游戏对象代理
class Agent {
    // 以下 public 属性和方法可供外部设置和调用

    // 当前游戏实例
    // 可通过该实例查询需要的信息，如当前轮数、历史记录等
    public gameInstance?: Game

    // 游戏开始前触发
    // 可在这个方法中初始化或还原 agent 状态
    public OnGameStarting: () => void = () => { };

    // 当轮到 agent 进行行动时触发
    public onUpdate: () => void = () => { };
    
    // 外部调用 agent.next(action) 方法通知游戏进行下一步
    public next(action: Action) {
        this.action = action;
        this._next();
    }
    

    

    // 以下部分仅供游戏环境访问，外部不可访问
    action: Action = new NoneAction();
    
    _next: () => void = () => { };
    
    update() {
        return new Promise<void>(resolve => {
            this._next = resolve;
            this.onUpdate();
        });
    }    

}




export { Agent }