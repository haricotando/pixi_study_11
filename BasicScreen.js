import GraphicsHelper from "./class/helper/GraphicsHelper.js";
import Utils from "./class/util/Utils.js";
import { dataProvider, dp } from "./dataProvider.js";
import { CommonButton } from "./CommonButton.js";
import { PlusMinusButton } from "./PlusMinusButton.js";

export class BasicScreen extends PIXI.Container {
    
    constructor() {
        super();
        this.title;
        this.subTitle;
        this.submitLabel;
        this.color = {};
        this.sortableChildren = true;
    }

    ranomColorPalette(){
        const randomIndex = Math.floor(Math.random() * dp.colorPalette.length);
        const colorPallete =  dp.colorPalette[randomIndex];

        const splitStringIntoChunks = (input, chunkSize) => {
            const result = [];
            for (let i = 0; i < input.length; i += chunkSize) {
                result.push(input.slice(i, i + chunkSize));
            }
            return result;
        }

        const res = splitStringIntoChunks(colorPallete, 6)
        this.color = {
            emph: `0x${res[0]}`,
            midA: `0x${res[1]}`,
            midB: `0x${res[2]}`,
            dark: `0x${res[3]}`,
        };
        
    }

    init(){
        this.frame = this.addChild(GraphicsHelper.exDrawRect(0, 0, dp.stageRect.width, dp.stageRect.height, false, {color:this.color.dark}));
        this.pivot.set(dp.stageRect.halfWidth, dp.stageRect.halfHeight);
        this.position.set(dp.stageRect.halfWidth, dp.stageRect.halfHeight);

        this.frame.height = 1;
        gsap.timeline()
            .to(this.frame.scale, {y:1, duration:0.3, ease:'expo.inOut'})

        this.textTitle = this.addChild(new PIXI.Text(` ${this.title} `, {
            fontFamily   : 'Inter',
            fontWeight   : 500,
            fontSize     : 65,
            fill         : this.color.emph,
            fontStyle    : 'italic',
            letterSpacing: 70,
        }));
        this.textTitle.anchor.set(0.5, 0.5);
        this.textTitle.x = dp.stageRect.halfWidth;
        this.textTitle.y = dp.stageRect.halfHeight / 4;
        this.textTitle.alpha = 0;
        gsap.timeline()
            .to(this.textTitle, {alpha:1, duration:0.3, ease:'none', delay:0.2})
            .to(this.textTitle.style, {letterSpacing: 10, duration:0.4, ease:'elastic.out(0.4)'} ,'<');

        this.textSubTitle;
        if(this.subTitle){
            this.textSubTitle = this.addChild(new PIXI.Text(` ${this.subTitle} `, {
                fontFamily   : 'Inter',
                fontWeight   : 500,
                fontSize     : 40,
                fill         : this.color.midB,
                fontStyle    : 'italic',
                letterSpacing: 70,
            }));
            this.textSubTitle.anchor.set(0.5, 0.5);
            this.textSubTitle.x = dp.stageRect.halfWidth;
            this.textSubTitle.y = this.textTitle.y + 70;
            
            this.textSubTitle.alpha = 0;
            gsap.timeline()
            .to(this.textSubTitle, {alpha:1, duration:0.3, ease:'none', delay:0.4})
            .to(this.textSubTitle.style, {letterSpacing: 10, duration:0.4, ease:'elastic.out(0.4)'} ,'<');
        }
        this.content = this.addChild(new PIXI.Container());

        /**
         * submit
         */
        this.submitBtn = this.addChild(new CommonButton(` ${this.submitLabel} `, this.color.emph));
        this.submitBtn.position.set(dp.stageRect.halfWidth, dp.stageRect.height - 200);
        const onTap = (e) => {
            this.submitBtn.onTapBehavior();
            this.submitBtn.cursor    = 'default';
            this.submitBtn.eventMode = 'none';
            this.onSubmit();
        };
        this.submitBtn.on('pointertap', onTap);

        gsap.delayedCall(0.4, ()=>{
            this.submitBtn.intro();
        });

        this.content.alpha = 0;
        this.content.y = -100;
        gsap.timeline()
            .to(this.content, {y:0, duration:0.3, ease:'elastic.out(0.5)', delay:0.3})
            .to(this.content, {alpha:1, duration:0.3, ease:'none'}, '<')
    }

    /** ============================================================
     * OUTRO
     */
    outro(){
        gsap.timeline()
            .to(this.textTitle, {alpha:0, duration:0.3, ease:'none'})
            .to(this.textTitle.style, {letterSpacing: 70, duration:0.3, ease:'expo.inOut'}, '<')
            .to(this.content, {y:100, duration:0.3, ease:'sine.in'}, '<')
            .to(this.content, {alpha:0, duration:0.3, ease:'none'}, '<')
            .to(this.frame, {y:dp.stageRect.height+5, duration:0.4, ease:'expo.inOut', delay:0.2})
            .call(()=>{
                this.nextAction();
                Utils.suicide(this);
            });

        if(this.subTitle){
            gsap.timeline()
                .to(this.textSubTitle, {alpha:0, duration:0.3, ease:'none', delay:0.2})
                .to(this.textSubTitle.style, {letterSpacing: 70, duration:0.3, ease:'expo.inOut'}, '<')
        }

    }

    /** ============================================================
     * NUMBER SELECTOR
     */
    initNumberContainer(suffix, dpStrVal, limit){
        const numberContainer = this.content.addChild(new PIXI.Container());
        numberContainer.position.set(dp.stageRect.halfWidth, dp.stageRect.halfHeight);

        const textNumber = numberContainer.addChild(new PIXI.Text('0 ', {
            fontFamily   : 'Inter',
            fontWeight   : 100,
            fontStyle    : 'italic',
            fontSize     : 700,
            fill         : this.color.emph,
            letterSpacing: -50,
        }));

        textNumber.anchor.set(0.5);

        const textSuffix = numberContainer.addChild(new PIXI.Text(suffix, {
            fontFamily   : 'Inter',
            fontWeight   : 500,
            fontSize     : 80,
            fill         : this.color.midA,
        }));
        textSuffix.anchor.set(0.5, 0.5);
        textSuffix.position.set(textNumber.width / 3, textNumber.height / 4);

        const updateNumber = (e) => {
            textNumber.text = `${dp.params[dpStrVal]} `;
            gsap.to(textSuffix, {x:textNumber.width / 3, y: textNumber.height / 4, duration:0.2, ease:'back.out(3)'})
        };

        updateNumber();
        Utils.snapshotPos(textNumber);

        /**
        * plus minus
        */
        const onPlus = (e) => {
            if(dp.params[dpStrVal] < limit){
                dp.params[dpStrVal] ++;
                e.currentTarget.onTapBehavior();
            }else{
                return false;
            }
            updateNumber();
            gsap.timeline()
                .set(textNumber.scale, {x:0.1})
                .set(textNumber, {y:textNumber.snapshot.y - 200})
                .to(textNumber.scale, {x:1, duration: 0.2, ease:'back.out(3)'})
                .to(textNumber, {y:textNumber.snapshot.y, duration: 0.2, ease:'back.out(3)'}, '<');
        };
        const plusButton = this.content.addChild(new PlusMinusButton(' + ', this.color.midB));
        plusButton.x = dp.stageRect.halfWidth + dp.stageRect.halfWidth / 1.5;
        plusButton.y = dp.stageRect.halfHeight + 50;
        plusButton.on('pointertap', onPlus);
        
        const onMinus = (e) => {
            if(dp.params[dpStrVal] > 1){
                dp.params[dpStrVal] --;
                e.currentTarget.onTapBehavior();
            }else{
                return false;
            }
            updateNumber();
            gsap.timeline()
                .set(textNumber.scale, {x:2})
                .set(textNumber, {y:textNumber.snapshot.y + 200})
                .to(textNumber.scale, {x:1, duration: 0.2, ease:'back.out(3)'})
                .to(textNumber, {y:textNumber.snapshot.y, duration: 0.2, ease:'back.out(3)'}, '<');
        };
        const minusButton = this.content.addChild(new PlusMinusButton(' - ', this.color.midB));
        minusButton.x = dp.stageRect.halfWidth - dp.stageRect.halfWidth / 1.5;
        minusButton.y = dp.stageRect.halfHeight + 50;
        minusButton.on('pointertap', onMinus);
    }
}