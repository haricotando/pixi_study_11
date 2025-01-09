import GraphicsHelper from "./class/helper/GraphicsHelper.js";
import Utils from "./class/util/Utils.js";
import { CommonButton } from "./CommonButton.js";
import { dataProvider, dp } from "./dataProvider.js";

export class GeneratorView extends PIXI.Container {
    
    constructor() {
        super();
        this.init();
    }

    init(){
        this.sortableChildren = true;

        const textTitle = this.addChild(new PIXI.Text("プレイヤー数", {
            fontFamily: 'Inter', 
            fontWeight: 700,
            fontSize: 65, fill: 0x545550,
            letterSpacing: 15,
        }));
        textTitle.anchor.set(0.5, 0);
        textTitle.x = dp.stageRect.halfWidth;
        textTitle.y = 300;

        const textNumber = this.addChild(new PIXI.Text(dp.params.players, {
            fontFamily: 'Inter', 
            fontWeight: 700,
            fontSize: 65, fill: 0x545550,
            letterSpacing: 15,
        }));
        textNumber.anchor.set(0.5, 0);
        textNumber.x = dp.stageRect.halfWidth;
        textNumber.y = 600;

        const plusButton = this.addChild(new CommonButton(' + '));
        plusButton.position.set(dp.stageRect.halfWidth, dp.stageRect.halfHeight);
        plusButton.cursor    = 'pointer';
        plusButton.eventMode = 'static';
        const onTapPlus = (e) => {
            dp.params.players ++;
            textNumber.text = dp.params.players;
            
        };
        plusButton.on('pointertap', onTapPlus);


        const submitBtn = this.addChild(new CommonButton(' QRを生成 '));
        submitBtn.position.set(dp.stageRect.halfWidth, dp.stageRect.height - 200);
        submitBtn.cursor    = 'pointer';
        submitBtn.eventMode = 'static';
        const onTap = (e) => {
            this.genQR();
            
        };
        submitBtn.on('pointertap', onTap);
    }

    genQR(){
        // gen table id
        dp.params.tableId = Date.now();

        const qr = qrcode(0, 'M');
        const url = window.location.href + `?table=${dp.params.tableId}&n=${dp.params.players}`;
        qr.addData(url);
        console.log(url);
        
        qr.make();
        const qrDataURL = qr.createDataURL(10, 0);
        const texture = PIXI.Texture.from(qrDataURL);
        
        const qrContainer = new PIXI.Sprite(texture);
        qrContainer.x = dp.stageRect.halfWidth - qrContainer.width / 2;
        qrContainer.y = dp.stageRect.halfHeight - qrContainer.width / 2;
        this.addChild(qrContainer);
        qrContainer.zIndex = 10;
    }
}