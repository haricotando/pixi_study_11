import Utils from "./class/util/Utils.js";
import { dataProvider, dp } from "./dataProvider.js";

export class AssetLoader extends PIXI.Container {
    
    constructor() {
        super();

        this._valLoaded = 0;
        this._loaded = 0;
        this.isAssetLoaded = false;

        this.labelContainer = this.addChild(new PIXI.Container());

        this.labelPercent = this.addChild(new PIXI.Text("...", {
            fontFamily: 'Inter', 
            fontWeight: 200,
            fontSize: 100, fill: 0x545550,
        }));
        this.labelPercent.anchor.set(0.5);

        this.labelAdditional = this.addChild(new PIXI.Text("", {
            fontFamily: 'Inter', 
            fontWeight: 400,
            fontSize: 30, fill: 0x545550,
        }));
        this.labelAdditional.anchor.set(0.5);
        this.labelAdditional.y = 70;
        
        this.addAssets();
    }
    
    /**
     * アセット登録
     */
    addAssets(){
        PIXI.Assets.add('rollrole1', Utils.addCacheBuster('./assets/rollrole1.mp3'));
        PIXI.Assets.add('taptap1', Utils.addCacheBuster('./assets/taptap1.mp3'));
        PIXI.Assets.add('tick1', Utils.addCacheBuster('./assets/tick1.mp3'));
        
        this._assetsLoad = [
            'rollrole1',
            'taptap1',
            'tick1',
        ];

        const onProgress = (e) => {
            this.labelPercent.text = `${Math.round(e * 100)}%`;
        }

        const assetsPromise = PIXI.Assets.load(this._assetsLoad, onProgress);
        
        assetsPromise.then((items) => {
            dp.assets = items;
            this.isAssetLoaded = true;
            this.afterLoad();
            // this.labelAdditional.text = 'CSV LOADING...';
            // this.loadCSV();
        });
    }

    /**
     * 固有追加
     */
    loadCSV(){
        const _this = this;
        const ssURL = './assets/sample.csv';
        
        const parseCSV = (data) => {
            this.labelAdditional.text = 'CSV PARSING...';
            const rows = [];
            let currentRow = [];
            let insideQuote = false;
            let field = '';
            for (let i = 0; i < data.length; i++) {
                const char = data[i];
                const nextChar = data[i + 1];
                if (char === '"' && nextChar === '"') {
                // ダブルクォートのエスケープ処理
                    field += '"';
                    i++;
                } else if (char === '"') {
                    // フィールド内外の切り替え
                    insideQuote = !insideQuote;
                } else if (char === ',' && !insideQuote) {
                    // フィールドの終了
                    currentRow.push(field);
                    field = '';
                } else if (char === '\n' && !insideQuote) {
                    // 行の終了
                    currentRow.push(field);
                    rows.push(currentRow);
                    currentRow = [];
                    field = '';
                } else {
                    // フィールドに文字を追加
                    field += char;
                }
            }
            // 最後の行を追加
            if (field || currentRow.length > 0) {
                currentRow.push(field);
                rows.push(currentRow);
            }
            return rows;
        }

        async function fetchSpreadsheetData() {
            try {
                const response = await fetch(ssURL);
                const text = await response.text();
                // 行を分割しつつ、改行を含むフィールドを結合
                const rows = parseCSV(text);
                // 最初の行をキーとして使用
                const keys = rows[0];
                // データ部分を構造体に変換
                const result = rows.slice(1).map(row => {
                const entry = {};
                keys.forEach((key, index) => {
                    entry[key.trim()] = (row[index]?.trim() || '');
                });
                return entry;
            });
            dp.assets.csv = result;
            _this.afterLoad();

            } catch (error) {
                console.error(error);
            }
        }
        fetchSpreadsheetData();
    }

    afterLoad(){
        this.emit("onComplete", { 
            isAssetLoaded : true,
            message: "アセット読み込み完了"
        });
    }
}