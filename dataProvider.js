export const dataProvider = {
    // 後から定義でも良いがコード保管のために undefined で定義だけする
    app: undefined,

    stageRect : {
        width             : undefined,
        height            : undefined,
        halfWidth         : undefined,
        halfHeight        : undefined,
        negativeWidth     : undefined,
        negativeHeight    : undefined,
        negativeHalfWidth : undefined,
        negativeHalfHeight: undefined,
    },

    assets: {},
    params: {
        tableId  : undefined,
        gameRound: 0,
        players  : 0,
    },

    textStyle: {},
    colorPalette: {},
};

export const dp = dataProvider;