/**
 * 
 */
import EventEmitter from "./EventEmitter";

export class Timer extends EventEmitter {
    constructor() {
        super();

        this.start = Date.now();
        this.current = this.start;
        this.elapsed = this.current - this.start; //インスタンス初期化時の時間以降の経過時間
        // this.delta = 0; //フレーム間の経過時間

        /**
         * deltaが0になるので下のようにすぐに tick() は呼ばない
         * deltaが0になる理由:
         *      contructor内のthis.currentが代入されてすぐにtick()が呼ばれる
         *      -> tick()内のcurrentもすぐに代入されるので this.current = currentTime になり、
         *         tick() 内のdeltaの計算結果が0になる
         */  
        // this.tick(); 

        window.requestAnimationFrame(() => {
            this.tick();
        });
    }

    tick() {
        const currentTime = Date.now();
        this.delta = currentTime - this.current;
        this.current = currentTime
        this.elapsed = currentTime - this.start;

        //イベント発火
        this.trigger("tick");

        window.requestAnimationFrame(() => {
            this.tick();
        });
    }
}