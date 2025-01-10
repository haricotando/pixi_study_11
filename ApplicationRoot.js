import { dataProvider, dp } from "./dataProvider.js";
import GraphicsHelper from "./class/helper/GraphicsHelper.js";
import { UIKitButton } from "./class/ui/UIKitButton.js";
import Utils from "./class/util/Utils.js";
import { GeneratorView } from "./GeneratorView.js";
import { PlayerView } from "./PlayerView.js";


export class ApplicationRoot extends PIXI.Container {
    
    
    constructor() {
        super();
        this.init();
    }
    
    init(){
        const frame = this.addChild(GraphicsHelper.exDrawRect(0, 0, dp.stageRect.width, dp.stageRect.height, {color:0xFF00FF, width:2}, {color:0x545550}));
    
        if(this.checkParam()){
          const playerView = this.addChild(new PlayerView());
        }else{
          const generatorView = this.addChild(new GeneratorView());
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
            dp.params.players = 0;
            return false;
        }
    }






    xinit(){
        const frame = this.addChild(GraphicsHelper.exDrawRect(0, 0, dp.stageRect.width, dp.stageRect.height, {color:0xFF00FF, width:2}, {color:0xEFEFEF}));
        /**
        * フォントのテスト
       */
        const textSample = this.addChild(new PIXI.Text("APP ROOT", {
            fontFamily: 'Inter', 
            fontWeight: 700,
            fontSize: 65, fill: 0x545550,
            letterSpacing: 15,
        }));
        textSample.anchor.set(0.5, 0);
        textSample.x = dp.stageRect.halfWidth;
        textSample.y = 100;


      // URLパラメータから tableId, n を取得
      const urlParams = new URLSearchParams(window.location.search);
      const tableId = urlParams.get('table');
      const n = parseInt(urlParams.get('n'), 10);
      
      // ハッシュ値をnで割った余り + 1 が「鬼の番号」
      const hashValue = this.simpleHash(tableId);
      const oniIndex = (hashValue % n) + 1;

      const uiButton1 = this.addChild(new UIKitButton(dp.app, '1'));
      uiButton1.position.set(50, 400);
      uiButton1.on('customEvent', (data) => {
          console.log(this.onInputNumber(oniIndex, 1));
        });
        
        const uiButton2 = this.addChild(new UIKitButton(dp.app, '2'));
        uiButton2.position.set(320, 400);
        uiButton2.on('customEvent', (data) => {
          console.log(this.onInputNumber(oniIndex, 2));
        });
        
        const uiButton3 = this.addChild(new UIKitButton(dp.app, '3'));
        uiButton3.position.set(590, 400);
        uiButton3.on('customEvent', (data) => {
          console.log(this.onInputNumber(oniIndex, 3));
        });
        
        const uiButton4 = this.addChild(new UIKitButton(dp.app, '4'));
        uiButton4.position.set(50, 500);
        uiButton4.on('customEvent', (data) => {
          console.log(this.onInputNumber(oniIndex, 4));
      });
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