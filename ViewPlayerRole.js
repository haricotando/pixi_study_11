import { BasicScreen } from "./BasicScreen.js";
import GraphicsHelper from "./class/helper/GraphicsHelper.js";
import Utils from "./class/util/Utils.js";
import { dataProvider, dp } from "./dataProvider.js";

export class ViewPlayerRole extends BasicScreen {
    
    constructor() {
        super();
        this.ranomColorPalette();

        this.title = 'プレイヤーの役割確認';
        this.subTitle = ` ゲームラウンド ${dp.params.gameRound}戦目 `;
        this.submitLabel = '役割を見る';
        this.flag = false;
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
        if(this.parent.isOni()){
            // this.textNumber.text = ' 鬼 ';
        }else{
            // this.textNumber.text = ' 村人 ';
        }

        const drumRollText = '!@#$%^&*?';
        let drumRollTextIndex = 0;

        const _this = this;

        gsap.timeline()
            .to(this.textNumber.scale, {x:0.4, y:0.4, duration:0.5, ease:'expo.In', 
                onUpdate: function() {
                    console.log(drumRollText[drumRollTextIndex]);
                    
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
        }else{
            dp.params.gameRound ++;
            this.outro();
        }
    }

    nextAction(){
        this.parent.initViewPlayerRoll();
        
    }







    xxxinit(){
        this.sortableChildren = true;
        const frame = this.addChild(GraphicsHelper.exDrawRect(0, 0, dp.stageRect.width, dp.stageRect.height, false, {color:0xEFEFEF}));
    
        this.pivot.set(dp.stageRect.halfWidth, dp.stageRect.halfHeight);
        this.position.set(dp.stageRect.halfWidth, dp.stageRect.halfHeight);
    
        const textTitle = this.addChild(new PIXI.Text(` ゲームラウンド：${dp.params.gameRound} `, {
            fontFamily   : 'Inter',
            fontWeight   : 500,
            fontSize     : 65,
            fill         : 0x000000,
            fontStyle    : 'italic',
        }));
        textTitle.anchor.set(0.5, 0.5);
        textTitle.x = dp.stageRect.halfWidth;
        textTitle.y = dp.stageRect.halfHeight / 4;
    
        const numberContainer = this.addChild(new PIXI.Container());
        numberContainer.position.set(dp.stageRect.halfWidth, dp.stageRect.halfHeight);
    
        const textNumber = numberContainer.addChild(new PIXI.Text('? ', {
            fontFamily   : 'Inter',
            fontWeight   : 100,
            fontStyle    : 'italic',
            fontSize     : 700,
            fill         : 0x000000,
            // fill: ['0x545550', '#666666', '#777777'],
            // fillGradientStops: [0.1, 0.5, 0.8],
            // fillGradientType: 0,
            letterSpacing: -50,
        }));
    
        textNumber.anchor.set(0.5);
        Utils.snapshotPos(textNumber);
    
        /**
         * submit
         */
        const submitBtn = this.addChild(new CommonButton('役割を確認'));
        submitBtn.position.set(dp.stageRect.halfWidth, dp.stageRect.height - 200);
        submitBtn.cursor    = 'pointer';
        submitBtn.eventMode = 'static';
        this.goNextGame = false;
        const onTap = (e) => {
            if(this.goNextGame){
                dp.params.gameRound ++;
                this.parent.startGame();
                Utils.suicide(this);
            }else{
                // this.onInputNumber(dp.params.playerId);
                textNumber.text = this.parent.isOni();
                submitBtn.labelText.text = '次のゲーム';
                this.goNextGame = true;
            }
        };
        submitBtn.on('pointertap', onTap);
    }
}