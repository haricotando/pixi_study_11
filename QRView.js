import GraphicsHelper from "./class/helper/GraphicsHelper.js";
import { dataProvider, dp } from "./dataProvider.js";

export class QRView extends PIXI.Container {
    
    constructor() {
        super();

        this.sortableChildren = true;
        this.frame = this.addChild(GraphicsHelper.exDrawRect(0, 0, dp.stageRect.width, dp.stageRect.height, false, {color:0xFFFFFF}));
        this.init();
    }
    
    init(){
        let bLoaded = false;
        const qr = qrcode(0, 'M');
        const url = window.location.href;
        qr.addData(url);
        qr.make();
        const qrDataURL = qr.createDataURL(20, 0);
        const texture = PIXI.Texture.from(qrDataURL);

        const onLoaded = (e) => {
            if(bLoaded){
                return false;
            }
            bLoaded = true;

            texture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
            const qrSprite = new PIXI.Sprite(texture);
            this.addChild(qrSprite);
            qrSprite.width = dp.stageRect.width - 40;
            qrSprite.height = dp.stageRect.height - 40;
            qrSprite.position.set(20, 20);
        }
        
        texture.baseTexture.once('loaded', () => {
            onLoaded();
        });

        if(texture.width){
            onLoaded();
        }
    }
}