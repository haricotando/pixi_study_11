import { dataProvider, dp } from "./dataProvider.js";
import { ApplicationRoot } from "./ApplicationRoot.js";
import { QRView } from "./QRView.js";
import Utils from "./class/util/Utils.js";

console.log(PIXI.VERSION);

/* ------------------------------------------------------------
    変数定義
------------------------------------------------------------ */
/**
 * @
 */
// const allowMobileOnly = true;
const allowMobileOnly = Utils.isOnGithub();
const backgroundColor = 0xEFEFEF;
const basePCView = {width: 980, height: 1668};

/* ------------------------------------------------------------
    アセット読み込み
------------------------------------------------------------ */
WebFont.load({
    google: {
        families: ['Noto Sans JP:800', 'Inter:100,300,500,700'],
    },
    
    active: () => {
        console.log('OK: Font');
        setTimeout(() => {
            init();
        }, 1000);
    },

    // フォント読み込み失敗時
    inactive: () => {
        console.log("ER: Font");
    },
});

function init(){
    let appConfig = {background: backgroundColor};
    
    // Setup
    if(Utils.isMobileDevice()){
        appConfig.resizeTo = window;
    }else{
        appConfig.width = allowMobileOnly ? 400 : basePCView.width;
        appConfig.height = allowMobileOnly ? 400 : basePCView.height;
        // 高解像度端末対応フラグ
        // appConfig.resolution = window.devicePixelRatio || 1;
        // appConfig.autoDensity = true;
        // canvasを中央へ
        const element = document.body;
        element.style.padding = '0';
        element.style.display = 'flex';
        element.style.justifyContent = 'center';
        element.style.alignItems = 'center';
        element.style.height = '100vh';
    }

    let app = new PIXI.Application(appConfig);
    app.view.id = 'pixi';
    document.body.appendChild(app.view);
    const canvas = document.getElementById('pixi');

    dp.app = app;
    dp.stageRect = {
        width             : app.screen.width,
        height            : app.screen.height,
        halfWidth         : app.screen.width * 0.5,
        halfHeight        : app.screen.height * 0.5,
        negativeWidth     : 0 - app.screen.width,
        negativeHeight    : 0 - app.screen.height,
        negativeHalfWidth : 0 - app.screen.width * 0.5,
        negativeHalfHeight: 0- app.screen.height * 0.5,
    }
    
    // Instance作成
    if(!Utils.isMobileDevice() && allowMobileOnly){
        const appRoot = app.stage.addChild(new QRView());
    }else{
        const appRoot = app.stage.addChild(new ApplicationRoot());
        if(Utils.isMobileDevice()){
            listenOrientationChange();
        }else{
            listenWindowResize();
        }
    }
}

/* ------------------------------------------------------------
    PCリサイズ判定
------------------------------------------------------------ */
function listenWindowResize(){
    const canvas = document.getElementById('pixi');
    const screenResize = () => {
        const wRatio = 0.9;
        const hRatio = 0.9;
        
        let maxW = wRatio * window.innerWidth;
        let maxH = hRatio * window.innerHeight;
        let resizeRatio = Math.min(maxW / basePCView.width, maxH / basePCView.height);
        if(maxW < basePCView.width || maxH < basePCView.height) {
            canvas.style.width = `${basePCView.width * resizeRatio}px`;
            canvas.style.height = `${basePCView.height * resizeRatio}px`;
        }
    }
    window.addEventListener('load', screenResize);
    window.addEventListener('resize',screenResize, false);
    screenResize();
}

/* ------------------------------------------------------------
    SP 画面回転判定
------------------------------------------------------------ */
function listenOrientationChange(){
    const message = document.createElement('div');
    message.id = 'orientation-message';
    message.innerText = '🔄';
    document.body.appendChild(message);
    const canvas = document.getElementById('pixi');

    const onOrientationChange = () => {
        const isPortrait = window.innerHeight > window.innerWidth;
        if(isPortrait){
            canvas.style.display = 'block';
            message.style.display = 'none';
        }else{
            canvas.style.display = 'none';
            message.style.display = 'block';
        }
    }
    window.addEventListener('resize', onOrientationChange);
}

function resumeAudioContext() {

    /**
     * @todo
     * 非公式プロパティアクセスになるのでライブラリバージョンを変える際に注意
     */
    if (!PIXI.sound._audioContext) {
        PIXI.sound._audioContext = new (window.AudioContext || window.webkitAudioContext)();
      }
      const audioCtx = PIXI.sound._audioContext;
    
    if (audioCtx.state === 'suspended') {
        audioCtx.resume().then(() => {
        console.log('AudioContext resumed');
        }).catch(err => {
            console.error('Error resuming AudioContext:', err);
        });
    }
}

// 1. ユーザー操作（タッチ終了時）に基づく再開
document.addEventListener('touchend', () => {
    resumeAudioContext();
});

// 2. ページの可視性変更時に基づく再開
document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
        resumeAudioContext();
    }
});