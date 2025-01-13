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
        gameRound: 1,
        players  : 1,
        playerId : 1,
    },

    textStyle: {},
    colorPalette: [
        '2135553e5879d8c4b6f5efe7',
        '2a004e500073c62300f14a00',
        'fbf5e5c890a7a35c7a212121',
        '222831393e4600adb5eeeeee',
        'f9ed69f08a5db83b5e6a2c70',
        '08d9d6252a34ff2e63eaeaea',
        '364f6b3fc1c9f5f5f5fc5185',
        'f5f7f8f4ce14495e5745474b',
        '2121213232320d737714ffec',
        '00000052057b892cdcbc6ff1',
        '07689fa2d5f2fafafaff7e67',
        '6fe7dd3490de6639a6521262',
        '071a5208697217b978a7ff83',
        'f85f73fbe8d3928a97283c63',
        'f7fd04f9b208f98404fc5404',
    ],
};

export const dp = dataProvider;