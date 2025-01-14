import { BasicScreen } from "./BasicScreen.js";
import { dataProvider, dp } from "./dataProvider.js";

export class ViewColorPalette extends BasicScreen {
    
    constructor() {
        super();
        this.checkColorPalette();

        this.title = 'カラーチェック';
        this.subTitle = '招待人数';
        this.submitLabel = 'コード生成';
        this.init();
        this.initNumberContainer('人', 'players', 10);
        
    }

    onSubmit(){
        this.outro();
    }
    
    nextAction(){
        this.parent.initDebugColorView();
        
    }
}