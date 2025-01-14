import { BasicScreen } from "./BasicScreen.js";
import GraphicsHelper from "./class/helper/GraphicsHelper.js";
import Utils from "./class/util/Utils.js";
import { dataProvider, dp } from "./dataProvider.js";

export class ViewPlayerRole extends BasicScreen {
    
    constructor() {
        super();
        this.ranomColorPalette();

        this.title = 'あなたの役割';
        this.subTitle = `ゲームラウンド：${dp.params.gameRound}`;
        this.submitLabel = '役割を見る';
        this.flag = false;
        this.playSound = false;
        this.init();
        this.initContent();
        
    }

    initContent(){
        this.numberContainer = this.content.addChild(new PIXI.Container());
        this.numberContainer.position.set(dp.stageRect.halfWidth, dp.stageRect.halfHeight);
    
        this.textNumber = this.numberContainer.addChild(new PIXI.Text('? ', {
            fontFamily   : 'Inter',
            fontWeight   : 100,
            fontStyle    : 'italic',
            fontSize     : 700,
            fill         : 0x000000,
            letterSpacing: -50,
        }));
    
        this.textNumber.anchor.set(0.5);
        Utils.snapshotPos(this.textNumber);    
    }

    checkMyRoll(){
        const drumRollText = '!@#$%^&*?';
        let drumRollTextIndex = 0;

        const _this = this;

        gsap.timeline()
            .to(this.textNumber.scale, {x:0.4, y:0.4, duration:0.7, ease:'expo.In', 
                onUpdate: function() {
                    _this.textNumber.text = ` ${drumRollText[drumRollTextIndex]} `;
                    drumRollTextIndex = ++drumRollTextIndex > drumRollText.length-1 ? 0 : drumRollTextIndex;
                }
            })
            .call(()=>{
              this.textNumber.text = this.parent.isOni() ? '鬼' : '人';
            })
            .to(this.textNumber.scale, {x:1, y:1, duration:0.3, ease:'elastic.out(3)'})

        gsap.delayedCall(1, ()=>{
            this.submitBtn.reactivateButton('次のゲーム');
        });
    }

    onSubmit(){
        if(!this.flag){
            this.checkMyRoll();
            this.flag = true;
            PIXI.sound.play('rollrole1');
            this.playSound = true;
        }else{
            dp.params.gameRound ++;
            this.outro();
        }
    }

    nextAction(){
        this.parent.initViewPlayerRoll();
        
    }
}