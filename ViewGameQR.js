import { BasicScreen } from "./BasicScreen.js";
import GraphicsHelper from "./class/helper/GraphicsHelper.js";
import { dataProvider, dp } from "./dataProvider.js";

export class ViewGameQR extends BasicScreen {
    
    constructor() {
        super();
        this.ranomColorPalette();

        this.title = '招待コード';
        this.subTitle = `招待人数 ${dp.params.players}人`;
        this.submitLabel = 'ゲームを開始';
        this.init();
        this.initContent();
        
    }

    initContent(){

        const qrModal = this.content.addChild(new PIXI.Container());

        const qr = qrcode(0, 'M');
        const url = window.location.href + `?table=${dp.params.tableId}&n=${dp.params.players}`;
        console.log(url);
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
        });
    

    }

    onSubmit(){
        this.outro();
    }

    nextAction(){
        this.parent.initViewPlayer();
        
    }
}
