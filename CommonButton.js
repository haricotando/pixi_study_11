import { dataProvider, dp } from "./dataProvider.js";
import GraphicsHelper from "./class/helper/GraphicsHelper.js";
import Utils from "./class/util/Utils.js";

export class CommonButton extends PIXI.Container {
    
    constructor(label, color = 0x000000) {
        super();

        this.button = this.addChild(new PIXI.Container());
        
        this.background = GraphicsHelper.exDrawRoundedRect(0, 0, dp.stageRect.width - 400, 150, 30, false, {color:0xFFFFFF});
        this.background.alpha = 0;
        Utils.pivotCenter(this.background);
        this.button.addChild(this.background);

        this.labelText = this.button.addChild(new PIXI.Text(label, {
            fontFamily   : 'Inter',
            fontWeight   : 300,
            fontSize     : 80,
            fill         : color,
            letterSpacing: 10,
        }));
        this.labelText.anchor.set(0.5, 0.5);

        this.underline = this.button.addChild(GraphicsHelper.exDrawRect(0, 0, this.labelText.width, 4, false, {color:color}));
        this.underline.pivot.set(this.underline.width / 2, 0);
        this.underline.position.y = this.labelText.height / 2;
        this.underline.width = dp.stageRect.width;
        this.alpha = 0;
    }

    intro(){
        gsap.timeline()
            .set(this.labelText.style, {letterSpacing: 70})
            .to(this.labelText.style, {letterSpacing: 10, duration:0.6, ease:'elastic.out(0.5)'})
            .to(this, {alpha:1, duration:0.1, ease:'none'}, '<')
            .to(this.underline.scale, {x:1, duration:0.3, ease:'expo.out'}, '<')
            .to(this.underline, {alpha:1, duration:0.1, ease:'none'}, '<')
            .to(this.labelText, {alpha: 1, duration:0.1, ease:'none'}, '<')
            .call(()=>{
                
                this.cursor    = 'pointer';
                this.eventMode = 'static';
            });
    }

    onTapBehavior(){
        gsap.timeline()
            .to(this.labelText.style, {letterSpacing: 80, duration:0.3, ease:'expo.out'})
            .to(this.underline, {width: dp.stageRect.width, duration:0.3, ease:'expo.out'}, '<')
            .to(this.underline, {width: 30, duration:0.3, ease:'expo.out'})
            .to(this.underline, {alpha:0, duration:0.3, ease:'none'}, '<')
            .to(this.labelText, {alpha: 0, duration:0.3, ease:'none'}, '<')
    }

    reactivateButton(label){
        if(label){
            this.labelText.text = label;
        }
        this.intro();
    }
}