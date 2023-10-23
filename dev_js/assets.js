export const textureKeys = {
    marsGame: 'marsGame',

    bgTile: 'bgTile',
    bgPixel: 'bgPixel',

    langRu: 'langRu',
    langEn: 'langEn',

    arrow: 'arrow',
    arrowBg: 'arrowBg',
    arrowBgWrong: 'arrowBgWrong',

    startRu: 'startRu',
    startEn: 'startEn',

    continueEn: 'continueEn',
    continueRu: 'continueRu',

    loginEn: 'loginEn',
    loginRu: 'loginRu',
    cancelEn: 'cancelEn',
    cancelRu: 'cancelRu',

    musicOn: 'musicOn',
    musicOff: 'musicOff',

    scores: 'scores',
    attempts: 'attempts',

    social: 'social',
    social_cl: 'social_cl',
    social_fb: 'social_fb',
    social_ig: 'social_ig',
    social_ok: 'social_ok',
    social_tg: 'social_tg',
    social_tt: 'social_tt',
    social_vb: 'social_vb',
    social_vk: 'social_vk',
    social_ws: 'social_ws',

    resultsOn: 'resultsOn',
    resultsOff: 'resultsOff',

    cup: 'cup',
    close: 'close',

    sphereAqua: 'sphereAqua',
    sphereBlue: 'sphereBlue',
    sphereLime: 'sphereLime',
    spherePink: 'spherePink',
    spherePurple: 'spherePurple',
}

// uploading in main js, before game init
export const fontKeys = {
    RobotoBlack: 'RobotoBlack',
    RobotoLight: 'RobotoLight',
}

export const soundKeys = {
    start: 'start',
    true: 'true',
    false: 'false',
    lose: 'lose',
    clear: 'clear',
    click: 'click',
    slide: 'slide',
}

export const musicKeys = {
    bgm0: 'bgm0',
    bgm1: 'bgm1',
    bgm2: 'bgm2',
}

const appAssets = {
    textures: {
        [textureKeys.marsGame] : './src/images/mars_game_logo_600x280px.png',

        [textureKeys.bgTile] : './src/images/background.png',
        [textureKeys.bgPixel] : './src/images/background_pixel.png',

        [textureKeys.langRu] : './src/images/lang_ru_320x320px.png',
        [textureKeys.langEn] : './src/images/lang_en_320x320px.png',

        [textureKeys.arrow]: './src/images/arrow_416x416px.png',
        [textureKeys.arrowBg]: './src/images/arrow_bg_416x416px.png',
        [textureKeys.arrowBgWrong]: './src/images/arrow_bg_wrong_416x416px.png',

        [textureKeys.startEn]: './src/images/start_en_680x260px.png',
        [textureKeys.startRu]: './src/images/start_ru_680x260px.png',

        [textureKeys.continueEn] : './src/images/continue_en_680x260px.png',
        [textureKeys.continueRu] : './src/images/continue_ru_680x260px.png',

        [textureKeys.loginEn] : './src/images/login_en_680x260px.png',
        [textureKeys.loginRu] : './src/images/login_ru_680x260px.png',
        [textureKeys.cancelEn] : './src/images/cancel_en_680x260px.png',
        [textureKeys.cancelRu] : './src/images/cancel_ru_680x260px.png',

        [textureKeys.musicOn]: './src/images/sound_on_420x320px.png',
        [textureKeys.musicOff]: './src/images/sound_off_420x320px.png',

        [textureKeys.scores]: './src/images/scores_320x320px.png',
        [textureKeys.attempts]: './src/images/attempts_280x320px.png',

        [textureKeys.social]: './src/images/social_400x320px.png',
        [textureKeys.social_cl]: './src/images/social_cl.png',
        [textureKeys.social_fb]: './src/images/social_fb.png',
        [textureKeys.social_ig]: './src/images/social_ig.png',
        [textureKeys.social_ok]: './src/images/social_ok.png',
        [textureKeys.social_tg]: './src/images/social_tg.png',
        [textureKeys.social_tt]: './src/images/social_tt.png',
        [textureKeys.social_vb]: './src/images/social_vb.png',
        [textureKeys.social_vk]: './src/images/social_vk.png',
        [textureKeys.social_ws]: './src/images/social_ws.png',

        [textureKeys.resultsOn]: './src/images/results_380x320px.png',
        [textureKeys.resultsOff]: './src/images/results_disable_380x320px.png',

        [textureKeys.cup]: './src/images/cup_272x260px.png',
        [textureKeys.close]: './src/images/close_260x260px.png',

        [textureKeys.sphereAqua]: './src/images/sphere_aqua.png',
        [textureKeys.sphereBlue]: './src/images/sphere_blue.png',
        [textureKeys.sphereLime]: './src/images/sphere_lime.png',
        [textureKeys.spherePink]: './src/images/sphere_pink.png',
        [textureKeys.spherePurple]: './src/images/sphere_purple.png',
    },
    sounds: {
        [soundKeys.start] : './src/sounds/se_start.mp3',
        [soundKeys.true] : './src/sounds/se_true.mp3',
        [soundKeys.false] : './src/sounds/se_false.mp3',
        [soundKeys.lose] : './src/sounds/se_lose.mp3',
        [soundKeys.clear] : './src/sounds/se_clear.mp3',
        [soundKeys.click] : './src/sounds/se_click.mp3',
        [soundKeys.slide] : './src/sounds/se_slide.mp3',
    },
    musics: {
        [musicKeys.bgm0] : './src/music/bgm_0.mp3',
        [musicKeys.bgm1] : './src/music/bgm_1.mp3',
        [musicKeys.bgm2] : './src/music/bgm_2.mp3',
    },
    fonts: {
        [fontKeys.RobotoBlack] : './src/fonts/RobotoBlack.ttf',
        [fontKeys.RobotoLight] : './src/fonts/RobotoLight.ttf',
    }
}

export default appAssets