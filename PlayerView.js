import GraphicsHelper from "./class/helper/GraphicsHelper.js";
import Utils from "./class/util/Utils.js";
import { dataProvider, dp } from "./dataProvider.js";

export class PlayerView extends PIXI.Container {
    
    constructor() {
        super();
        this.init();
    }

    init(){
        /**
        * フォントのテスト
       */
        const textSample = this.addChild(new PIXI.Text("player view", {
            fontFamily: 'Inter', 
            fontWeight: 700,
            fontSize: 65, fill: 0x545550,
            letterSpacing: 15,
        }));
        textSample.anchor.set(0.5, 0);
        textSample.x = dp.stageRect.halfWidth;
        textSample.y = 300;
    }
}