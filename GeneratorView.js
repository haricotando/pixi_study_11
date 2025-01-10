import GraphicsHelper from "./class/helper/GraphicsHelper.js";
import Utils from "./class/util/Utils.js";
import { CommonButton } from "./CommonButton.js";
import { dataProvider, dp } from "./dataProvider.js";
import { PlusMinusButton } from "./PlusMinusButton.js";

export class GeneratorView extends PIXI.Container {
    
    constructor() {
        super();
        this.init();
    }

    init(){
        const frame = this.addChild(GraphicsHelper.exDrawRect(0, 0, dp.stageRect.width, dp.stageRect.height, false, {color:0xEFEFEF}));
        this.sortableChildren = true;

        this.pivot.set(dp.stageRect.halfWidth, dp.stageRect.halfHeight);
        this.position.set(dp.stageRect.halfWidth, dp.stageRect.halfHeight);

        const textTitle = this.addChild(new PIXI.Text(" プレイヤー数設定 ", {
            fontFamily   : 'Noto Sans JP',
            fontWeight   : 800,
            fontSize     : 65,
            fill         : 0x545550,
            fontStyle    : 'italic',
            letterSpacing: 15,
        }));
        textTitle.anchor.set(0.5, 0);
        textTitle.x = dp.stageRect.halfWidth;
        textTitle.y = 300;

        const textNumber = this.addChild(new PIXI.Text(dp.params.players, {
            fontFamily   : 'Inter',
            fontWeight   : 700,
            fontStyle    : 'italic',
            fontSize     : 800,
            fill         : 0x545550,
            letterSpacing: 15,

            fill: ['0x545550', '#666666', '#777777'],
            fillGradientStops: [0.1, 0.5, 0.8],
            fillGradientType: 0,

        }));
        textNumber.anchor.set(0.5);
        textNumber.x = dp.stageRect.halfWidth;
        textNumber.y = dp.stageRect.halfHeight;

        /**
        * plus minus
        */
        const onPlus = (e) => {
            dp.params.players ++;
            textNumber.text = ` ${dp.params.players} `;
            gsap.timeline()
                .set(textNumber, {y:dp.stageRect.halfHeight - 100})
                .to(textNumber, {y:dp.stageRect.halfHeight, duration: 0.2, ease:'back.out(1)'})
        };
        const plusButton = this.addChild(new PlusMinusButton(' + '));
        plusButton.x = dp.stageRect.halfWidth + dp.stageRect.halfWidth / 1.5;
        plusButton.y = dp.stageRect.halfHeight + 50;
        plusButton.on('pointertap', onPlus);
        
        const onMinus = (e) => {
            dp.params.players --;
            textNumber.text = ` ${dp.params.players} `;
            gsap.timeline()
            .set(textNumber, {y:dp.stageRect.halfHeight + 100})
            .to(textNumber, {y:dp.stageRect.halfHeight, duration: 0.2, ease:'back.out(1)'})
        };
        const minusButton = this.addChild(new PlusMinusButton(' - '));
        minusButton.x = dp.stageRect.halfWidth - dp.stageRect.halfWidth / 1.5;
        minusButton.y = dp.stageRect.halfHeight + 50;
        minusButton.on('pointertap', onMinus);

        /**
         * submit
         */
        const submitBtn = this.addChild(new CommonButton(' QR表示 '));
        submitBtn.position.set(dp.stageRect.halfWidth, dp.stageRect.height - 200);
        submitBtn.cursor    = 'pointer';
        submitBtn.eventMode = 'static';
        const onTap = (e) => {
            this.genQR();
        };
        submitBtn.on('pointertap', onTap);
    }

    genQR(){

        const cover = Utils.addFullScreenRect(false, {color:0x000000});
        cover.alpha = 0;
        cover.cursor = 'pointer';
        cover.eventMode = 'static';
        this.addChild(cover);

        const qrModal = this.addChild(new PIXI.Container());

        const onTap = (e) => {
            gsap.timeline()
            .to(cover, {alpha:0, duration:0.2, ease:'none'})
            .to(qrModal, {alpha:0, duration:0.2, ease:'none'}, '<')
            .to(this.scale, {x:1, y:1, duration:0.3, ease:'sine.out'}, '<')

            .call(()=>{
                this.removeChild(cover);
                this.removeChild(qrModal);
            });
            
        };
        cover.on('pointertap', onTap);
        
        gsap.timeline()
            .to(cover, {alpha:0.5, duration:0.3, ease:'none'})

        // gen table id
        dp.params.tableId = Date.now();
        
        const qr = qrcode(0, 'M');
        const url = window.location.href + `?table=${dp.params.tableId}&n=${dp.params.players}`;
        qr.addData(url);
        qr.make();
        const qrDataURL = qr.createDataURL(20, 0);
        const texture = PIXI.Texture.from(qrDataURL);
        
        texture.baseTexture.once('loaded', () => {
            texture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
            const qrSprite = new PIXI.Sprite(texture);
            qrModal.addChild(GraphicsHelper.exDrawRoundedRect(0, 0, qrSprite.width + 100, qrSprite.height + 100, 20, false, {color:0xFFFFFF}));
            qrModal.pivot.set(qrModal.width / 2, qrModal.height / 2);
            qrModal.position.set(dp.stageRect.halfWidth, dp.stageRect.halfHeight);
            qrSprite.position.set(qrModal.width / 2 - qrSprite.width / 2)
            qrModal.addChild(qrSprite);
            qrModal.alpha = 0;
            gsap.timeline()
                .to(this.scale, {x:0.96, y:0.96, duration: 0.3, ease:'power4.out'})
                .to(qrModal, {alpha:1, duration:0.2, ease:'none'}, '<0.1');
        });
    }
}