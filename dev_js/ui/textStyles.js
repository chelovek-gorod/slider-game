import { TextStyle } from "pixi.js"
import { fontKeys } from "../assets"

// https://pixijs.io/pixi-text-style/

export const textStyles = {
    loading: new TextStyle({
        fontFamily: fontKeys.RobotoLight,
        fontSize: 24,
        fill: '#000000',
        align: 'center'
    }),

    scores: new TextStyle({
        fontFamily: fontKeys.RobotoBlack,
        fontSize: 32,
        fill: ['#112233', '#555555', '#112233'],
        align: 'left',

        dropShadow: true,
        dropShadowColor: '#ffffff',
        dropShadowBlur: 6,
        dropShadowAngle: 0,
        dropShadowDistance: 0,
    }),

    attempts: new TextStyle({
        fontFamily: fontKeys.RobotoBlack,
        fontSize: 32,
        fill: ['#112233', '#555555', '#112233'],
        align: 'right',

        dropShadow: true,
        dropShadowColor: '#ffffff',
        dropShadowBlur: 6,
        dropShadowAngle: 0,
        dropShadowDistance: 0,
    }),

    message: new TextStyle({
        fontFamily: fontKeys.RobotoLight,
        fontSize: 32,
        fill: '#000000',
        align: 'center',

        wordWrap: true,
        wordWrapWidth: 400,
    }),

    results: new TextStyle({
        fontFamily: fontKeys.RobotoLight,
        fontSize: 32,
        fill: '#000000',
        align: 'center',

        wordWrap: true,
        wordWrapWidth: 400,
    }),

    counter: new TextStyle({
        fontFamily: fontKeys.RobotoLight,
        fontSize: 32,
        fill: ['#aaaaaa', '#ffffff', '#aaaaaa'],

        dropShadow: true,
        dropShadowColor: '#000000',
        dropShadowAngle: 0,
        dropShadowBlur: 4,
        dropShadowDistance: 0,
    }),

    gradientText: new TextStyle({
        fontFamily: fontKeys.RobotoBlack,
        fontSize: 32,
        fill: ['#000000', '#ff0064', '#000000'],

        dropShadow: true,
        dropShadowColor: '#ffffff',
        dropShadowBlur: 6,
        dropShadowAngle: 0,
        dropShadowDistance: 0,

        wordWrap: true,
        wordWrapWidth: 400,
    }),

    textWithShadow: new TextStyle({
        fontFamily: fontKeys.RobotoBlack,
        fontSize: 18,
        fontStyle: 'normal',
        fontWeight: 'normal',
        fill: ['#ff0000', '#ffff00'],
        /*
        stroke: '#ffffff',
        strokeThickness: 2,
        */
        /*
        dropShadow: true,
        dropShadowColor: '#ff00ff',
        dropShadowBlur: 3,
        dropShadowDistance: 4,
        */
        wordWrap: true,
        wordWrapWidth: 440,
        lineJoin: 'round',
    }),
}