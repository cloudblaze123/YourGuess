import { Action, NoneAction } from "@/game/action";



// 游戏对象代理
class Agent {
    // 以下 public 属性和方法可供外部设置和调用

    // 当轮到 agent 进行行动时触发
    public onUpdate: () => void = () => { };
    
    // 外部调用 agent.next(action) 方法通知游戏进行下一步
    public next(action: Action) {
        this.action = action;
        this._next();
    }
    

    

    // 以下部分仅供游戏环境访问，外部不可访问
    action: Action = new NoneAction();
    
    private _next: () => void = () => { };
    
    update() {
        const promise = new Promise<void>(resolve => {
            this._next = resolve;
        });
        this.onUpdate();
        return promise
    }    

}




export { Agent }