/**
 * Canvas のサイズに関する util クラス
 */
import EventEmitter from "./EventEmitter";

export class Sizes extends EventEmitter {
    constructor() {
        super();

        // ウィンドウサイズを記録
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        // ピクセル比を決定
        this.pixelRatio = Math.min(window.devicePixelRatio, 2);

        // リサイズイベント時にウィンドウサイズを更新
        window.addEventListener('resize', () => {
            // Update sizes
            this.width = window.innerWidth
            this.height = window.innerHeight
            this.pixelRatio = Math.min(window.devicePixelRatio, 2);
            this.trigger("resize");
        })
    }
}