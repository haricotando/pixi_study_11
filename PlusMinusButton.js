import { dataProvider, dp } from "./dataProvider.js";
import GraphicsHelper from "./class/helper/GraphicsHelper.js";
import Utils from "./class/util/Utils.js";

export class PlusMinusButton extends PIXI.Container {
    
    constructor(label) {
        super();

        this.button = this.addChild(new PIXI.Container());
        
        this.background = GraphicsHelper.exDrawRoundedRect(0, 0, 150, 150, 30, false, {color:0xFFFFFF});
        this.background.alpha = 0.5;
        Utils.pivotCenter(this.background);
        this.button.addChild(this.background);

        this.cursor    = 'pointer';
        this.eventMode = 'static';

        this.labelText = this.button.addChild(new PIXI.Text(label, {
            fontFamily        : 'Noto Sans JP',
            fontWeight        : 800,
            fontSize          : 150,
            fill              : 0xEFEFEF,
            // fontStyle         : 'italic',
            dropShadow        : true,
            dropShadowColor   : '#000000',
            dropShadowAlpha   : 0.9,
            dropShadowBlur    : 16,
            dropShadowAngle   : 0,
            dropShadowDistance: 0,
            
        }));
        this.labelText.anchor.set(0.5, 0.5);
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