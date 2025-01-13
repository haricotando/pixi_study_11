import { dataProvider, dp } from "./dataProvider.js";
import GraphicsHelper from "./class/helper/GraphicsHelper.js";
import { ViewDealer } from "./ViewDealer.js";
import { ViewPlayer } from "./ViewPlayer.js";
import { ViewGameQR } from "./ViewGameQR.js";
import { ViewPlayerRole } from "./ViewPlayerRole.js";


export class ApplicationRoot extends PIXI.Container {
  
    constructor() {
        super();
        this.init();
    }
    
    init(){
        const frame = this.addChild(GraphicsHelper.exDrawRect(0, 0, dp.stageRect.width, dp.stageRect.height, false, false));
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
    
    checkParam(){
        const urlParams = new URLSearchParams(window.location.search);
        const tableId = urlParams.get('table');
        if(tableId){
            dp.params.tableId = tableId;
            dp.params.players = urlParams.get('n');
            return true;
        }else{
            // dp.params.players = 0;
            return false;
        }
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

    isOni(){
        const hashValue = this.simpleHash(dp.params.tableId + '_' + dp.params.gameRound);
        const oniIndex = (hashValue % dp.params.players) + 1;

        let buffer = {};
        for(let i=0; i<dp.params.players; i++){
            const player = i+1;
            const res = oniIndex === (player);
            buffer['p' + player] = res;
        }
        console.log(buffer);
        return oniIndex === dp.params.playerId;
    }

    simpleHash(str) {
      // 簡易サンプル: 文字列のUTF-16コード合計をとる
        let sum = 0;
        for (let i = 0; i < str.length; i++) {
            sum += str.charCodeAt(i);
        }
        return sum;
    }
    
    // ユーザが順番 i を入力したら:
    onInputNumber(oniIndex, i) {
        if (i === oniIndex) {
            return true;
        } else {
            return false;
        }
    }
}