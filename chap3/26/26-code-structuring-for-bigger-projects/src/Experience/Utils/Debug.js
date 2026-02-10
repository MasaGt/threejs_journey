/**
 * lil gui を管理するクラス
 */

import GUI from 'lil-gui';

export class Debug {

    constructor() {
        this.isActive = window.location.hash === "#debug";
        if (this.isActive) {
            this.gui = new GUI();
            this.debugObject = {};
        }
    }
}