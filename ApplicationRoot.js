import { dataProvider, dp } from "./dataProvider.js";
import GraphicsHelper from "./class/helper/GraphicsHelper.js";
import { ViewDealer } from "./ViewDealer.js";
import { ViewPlayer } from "./ViewPlayer.js";
import { ViewGameQR } from "./ViewGameQR.js";
import { ViewPlayerRole } from "./ViewPlayerRole.js";
import { AssetLoader } from "./AssetLoader.js";
import { ViewColorPalette } from "./ViewColorPalette.js";

export class ApplicationRoot extends PIXI.Container {
    constructor() {
        super();
        this.loadAssets();
    }
    
    loadAssets(){
        const assetLoader = this.addChild(new AssetLoader());
        assetLoader.x = dp.stageRect.halfWidth;
        assetLoader.y = dp.stageRect.halfHeight-40;
        // Utils.layoutCenter(assetLoader, dp.stageRect);
        
        assetLoader.on('onComplete', (data) => {
            gsap.timeline({delay: 0.3})
                .to(assetLoader, {alpha:0, duration: 0.2, ease:'none'})
                .call(()=>{
                    this.removeChild(assetLoader);
                    this.init();
                });
        });
    }
    
    init(){
        const frame = this.addChild(GraphicsHelper.exDrawRect(0, 0, dp.stageRect.width, dp.stageRect.height, false, false));

        // this.addChild(new ViewColorPalette());
        // return false;
        // dp.params.players = 2;
        // dp.params.playerId = 1;
        // this.initViewPlayerRoll();
        // return false;
    
        if(this.checkParam()){
            this.initViewPlayer();
        }else{
            this.initViewDealer();
        }
    }
    
    /* -------------------------------------------------------
    *    queryから必要なパラメーター取り出し
    ------------------------------------------------------- */
    checkParam(){
        const urlParams = new URLSearchParams(window.location.search);
        const tableId = urlParams.get('table');
        if(tableId){
            dp.params.tableId = tableId;
            dp.params.players = parseInt(urlParams.get('n'), 10);
            return true;
        }else{
            return false;
        }
    }


    /* =======================================================
    *    主要View生成
    ======================================================= */
    initDebugColorView(){
        this.addChild(new ViewColorPalette());
    }
    
    initViewDealer(){
        this.addChild(new ViewDealer());
    }
    
    initViewGameQR(){
        console.log('2');
        
        dp.params.tableId = Date.now();
        this.addChild(new ViewGameQR());
    }
    
    initViewPlayer(){
        this.addChild(new ViewPlayer());
    }

    initViewPlayerRoll(){
        this.addChild(new ViewPlayerRole());
    }


    /* =======================================================
    *    ロール決定ロジック
    ======================================================= */
    determineRole_1_Heretic_1_Special() {
        const hashValue = this.simpleHash(dp.params.tableId + '_' + dp.params.gameRound);
        const oniIndex = (hashValue % dp.params.players) + 1;

        // ユーザーが鬼であれば結果を返す
        if (dp.params.playerId === oniIndex) {
            return "鬼";
        }

        // 鬼以外の番号リストを作成
        const villagerIndices = [];
        for (let i = 1; i <= dp.params.players; i++) {
            if (i !== oniIndex) villagerIndices.push(i);
        }

        // 特別な村人の順番を決定
        const specialVillagerIndex = villagerIndices[hashValue % villagerIndices.length];

        if (dp.params.playerId === specialVillagerIndex) {
            return "特人";
        }
        return "人";
    }

    determineRole_1_Heretic(){
        const hashValue = this.simpleHash(dp.params.tableId + '_' + dp.params.gameRound);
        const oniIndex = (hashValue % dp.params.players) + 1;

        let buffer = {};
        for(let i=0; i<dp.params.players; i++){
            const player = i+1;
            const res = oniIndex === (player);
            buffer['p' + player] = res;
        }
        const result = oniIndex === dp.params.playerId ? '鬼' : '人';
        return result;
    }

    simpleHash(str) {
      // 簡易サンプル: 文字列のUTF-16コード合計をとる
        let sum = 0;
        for (let i = 0; i < str.length; i++) {
            sum += str.charCodeAt(i);
        }
        return sum;
    }

    
}