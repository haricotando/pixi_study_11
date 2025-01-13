import { dataProvider, dp } from "./dataProvider.js";
import GraphicsHelper from "./class/helper/GraphicsHelper.js";
import Utils from "./class/util/Utils.js";

export class PlusMinusButton extends PIXI.Container {
    
    constructor(label, color = 0x000000) {
        super();

        this.button = this.addChild(new PIXI.Container());
        
        this.background = GraphicsHelper.exDrawRoundedRect(0, 0, 150, 150, 30, false, {color:0xFFFFFF});
        this.background.alpha = 0
        Utils.pivotCenter(this.background);
        this.button.addChild(this.background);

        this.cursor    = 'pointer';
        this.eventMode = 'static';

        this.labelText = this.button.addChild(new PIXI.Text(label, {
            fontFamily        : 'Inter',
            fontWeight        : 100,
            fontSize          : 150,
            fill              : color,
            
        }));
        this.labelText.anchor.set(0.5, 0.5);
    }

    onTapBehavior(){
        gsap.timeline()
            .set(this.scale, {x:3, y:3})
            .to(this.scale, {x:1, y:1, duration:0.5, ease:'elastic.out(0.5)'});
    }

    activate(){
        gsap.timeline()
        .to(this.background, {alpha:0.8, duration:0.2, ease:'expo.out'}, '<')
        .to(this.backgroundRim.scale, {x:1.1, y:1.2, duration:0.2, ease:'expo.out'}, '<')
        .to(this.background.scale, {x:1.1, y:1.2, duration:0.2, ease:'expo.out'}, '<')
        .to(this.labelText.scale, {x:0.7, y:0.7, duration:0.3, ease:'back.out(2)'}, '<')
        .to(this, {alpha:0, duration:0.2, ease:'none'}, '<')
    }
}