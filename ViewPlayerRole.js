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
    
        // this.textNumber = this.numberContainer.addChild(new PIXI.Text('# ', {
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
        const drumRollText = '@!@#$%^&*?';
        let drumRollTextIndex = 0;
        
        const _this = this;
        
        gsap.timeline()
        .to(this.textNumber.scale, {x:0.5, y:0.5, duration:0.7, ease:'expo.In', 
            onUpdate: function() {
                _this.textNumber.text = `${drumRollText[drumRollTextIndex]} `;
                drumRollTextIndex = ++drumRollTextIndex > drumRollText.length-1 ? 0 : drumRollTextIndex;
            }
        })
        .call(()=>{
            
            /**
             * 利用ロジックを選ぶ
             */
            // マルチロール
            this.textNumber.text = this.parent.determineRole_1_Heretic_1_Special();
            this.textNumber.style.fontSize = 500;
            
            // 鬼 / 人
            // this.textNumber.text = this.parent.determineRole_1_Heretic();
        })
        .to(this.textNumber.scale, {x:1, y:1, duration:0.1, ease:'elastic.out(1)'})
        .to(this.textNumber.scale, {x:1.1, y:1.1, duration:0.7, ease:'expo.out'})
        
        gsap.delayedCall(1, ()=>{
            this.submitBtn.reactivateButton('次のゲーム');
        });
        
    }


    fx(){

        const displacementDefaultScale = 100;
        
        const displacementSprite = PIXI.Sprite.from(dp.assets.displacement_map);
        displacementSprite.texture.baseTexture.wrapMode = PIXI.WRAP_MODES.REPEAT;

        const displacementFilter = new PIXI.DisplacementFilter(displacementSprite);
        displacementFilter.scale.x = displacementDefaultScale;
        displacementFilter.scale.y = displacementDefaultScale;

        this.content.filters = [displacementFilter];

        const bulgeDefaultRadius = 250;
        const bulgeDefaultStrength = 0;
        const bulgePinchFilter = new PIXI.filters.BulgePinchFilter(
            {
                center:     [0.5, 0.5],             // 画像の中央に効果を適用
                radius:     bulgeDefaultRadius,     // 効果の半径
                strength:   bulgeDefaultStrength,   // 効果の強さ（1で最大膨張、-1で最大縮小）
            }
        )
        
        this.content.filters.push(bulgePinchFilter);

        gsap.timeline()
        .to(bulgePinchFilter, {radius: 400, strength:-0.7,  duration:0.4, ease:'circ.out'})
        .call(()=>{
            this.changeColor();
        })
        .to(bulgePinchFilter, {radius: 0, strength:0,  duration:0.4, ease:'expo.inOut'})
        .to(displacementFilter.scale, {x:1, y:1, duration:0.3, ease:'expo.out'}, '<')
    }

    onSubmit(){
        if(!this.flag){
            this.checkMyRoll();
            this.fx();
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