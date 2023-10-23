import { Graphics } from 'pixi.js'
import { ColorGradientFilter } from '@pixi/filter-color-gradient';
import { tickerUpdateAdd, tickerUpdateRemove } from '../appScreen'
import { textureKeys, soundKeys } from "../assets"
import { getTexture } from "../loader"
import constants from '../constants';
import { playSound } from "../sound";
import { UI } from './interface';

const slideSpeedFrames = constants.slideInOutTime / constants.tick
const slideSpeed = 1 / slideSpeedFrames

let side = Math.floor(Math.random() * 4)
function getSide() {
    side = (side + Math.ceil(Math.random() * 3)) % 4
    return side
}

const colors = [
    [0xe90000, 0xfaa6ff],
    [0xfacc22, 0xf83600],
    [0xe9fe93, 0x4b431c],
    [0xffb330, 0xfffcce],
    [0xf2f047, 0x1ed94f],
    [0x1bfff3, 0x0bdc37],
    [0x305170, 0x6dfc6b],
    [0x330d69, 0x30c9cd],
    [0x88d0cf, 0x2727d5],
    [0x00f2fe, 0x8e2de2],
    [0x4355d4, 0xb143ea],
    [0xc82090, 0x6a14d1],
]
let colorIndex = Math.floor( Math.random() * colors.length )

function getRandomAngle() {
    return 45 + Math.floor( Math.random() * 4 ) * 90
}

function getFilter() {
    colorIndex = (colorIndex + ( Math.random() < 0.5 ? 3 : 4 )) % colors.length
    const filter = {
        type: ColorGradientFilter.LINEAR, stops: [
          { offset: 0.0, color: colors[colorIndex][0], alpha: 1.0, },
          { offset: 1.0, color: colors[colorIndex][1], alpha: 1.0, },
        ], angle: getRandomAngle(), alpha: 1.0,
    }
    return filter
}

class Slide extends Graphics {
    constructor (appScreen, slideReady) {
        super()
        this.filters = [ new ColorGradientFilter( getFilter() ) ]
        this.screen = appScreen
        this.side = getSide()
        this.sizeScale = 0
        this.isOnOpen = true
        this.resize(appScreen)
        this.speed = slideSpeed
        this.readyCallback = slideReady
        
        UI.slidesContainer.addChild(this)
        tickerUpdateAdd(this)
        playSound(soundKeys.slide)
    }

    resize(appScreen) {
        this.screen = appScreen

        this.clear()
        this.beginFill(0xffffff, 1)
        this.drawRect(0, 0, appScreen.width, appScreen.height)
        this.endFill()

        switch(this.side) {
            case 0 :
                this.position.x = 0
                this.position.y = this.height * this.sizeScale - this.height
            break;
            case 1 :
                this.position.x = this.width - this.width * this.sizeScale
                this.position.y = 0
            break;
            case 2 :
                this.position.x = 0
                this.position.y = this.height - this.height * this.sizeScale
            break;
            case 3 :
                this.position.x = this.width * this.sizeScale - this.width
                this.position.y = 0
            break;
        }
    }

    change( scale ) {
        this.sizeScale += scale * this.speed

        if (this.sizeScale > 1) {
            this.isOnOpen = false
            this.sizeScale = 1
            tickerUpdateRemove(this)

            if (this.readyCallback) {
                setTimeout(() => {
                    this.readyCallback()
                }, constants.slideNextDelay)
            }
            //if (this.readyCallback) this.readyCallback()
        }

        if (this.sizeScale < 0) {
            this.sizeScale = 0
            tickerUpdateRemove(this)
            UI.slidesContainer.removeChild(this)
            if (this.readyCallback) this.readyCallback(this)
            return
        }

        switch(this.side) {
            case 0 : this.position.y = this.height * this.sizeScale - this.height; break;
            case 1 : this.position.x = this.width - this.width * this.sizeScale; break;
            case 2 : this.position.y = this.height - this.height * this.sizeScale; break;
            case 3 : this.position.x = this.width * this.sizeScale - this.width; break;
        }
    }

    hide(callback) {
        this.readyCallback = callback
        tickerUpdateAdd(this)
    }

    tick( delta ) {
        if (this.isOnOpen) this.change(delta)
        else this.change(-delta)
    }
}

export default Slide

/*

import { TilingSprite } from 'pixi.js'
import { ColorGradientFilter } from '@pixi/filter-color-gradient';
import { tickerUpdateAdd, tickerUpdateRemove } from '../appScreen'
import { textureKeys, soundKeys } from "../assets"
import { getTexture } from "../loader"
import constants from '../constants';
import { playSound } from "../sound";
import { UI } from './interface';

const slideSpeedFrames = constants.slideInOutTime / constants.tick
const slideSpeed = 1 / slideSpeedFrames

const colors = [
    0xff0000, 0xffff00, 0x00ff00, 0x00ffff, 0x0000ff, 0xff00ff,
]

let colorIndex = Math.floor( Math.random() * colors.length )
let side = Math.floor(Math.random() * 4)

function getRandomAngle() {
    return 45 + Math.floor( Math.random() * 4 ) * 90
}

function getFilter() {
    colorIndex = (colorIndex + Math.ceil( Math.random() * 3 )) % colors.length
    let colorIndex2 = colorIndex + 1
    if (colorIndex2 === colors.length) colorIndex2 = 0
    const filter = {
        type: ColorGradientFilter.LINEAR, stops: [
          { offset: 0.0, color: colors[colorIndex], alpha: 1.0, },
          { offset: 1.0, color: colors[colorIndex2], alpha: 1.0, },
        ], angle: getRandomAngle(), alpha: 0.8,
    }
    return filter
}

function getSide() {
    side = (side + Math.ceil(Math.random() * 3)) % 4
    return side
}

let textureNumber = Math.ceil(Math.random() * 6)
function getRandomTexture() {
    textureNumber = (textureNumber + Math.ceil(Math.random() * 2)) % 6
    return getTexture(textureKeys['slide'+ (textureNumber + 1)])
}

class Slide extends TilingSprite {
    constructor (appScreen, slideReady) {
        super( getRandomTexture() )
        this.filters = [ new ColorGradientFilter( getFilter() ) ]
        this.screen = appScreen
        this.side = getSide()
        this.sizeScale = 0
        this.isOnOpen = true
        this.resize(appScreen)
        this.speed = slideSpeed
        this.readyCallback = slideReady
        
        UI.slidesContainer.addChild(this)
        tickerUpdateAdd(this)
        playSound(soundKeys.slide)
    }

    resize(appScreen) {
        this.screen = appScreen

        this.width = appScreen.width
        this.height = appScreen.height

        switch(this.side) {
            case 0 :
                this.position.x = 0
                this.position.y = this.height * this.sizeScale - this.height
            break;
            case 1 :
                this.position.x = this.width - this.width * this.sizeScale
                this.position.y = 0
            break;
            case 2 :
                this.position.x = 0
                this.position.y = this.height - this.height * this.sizeScale
            break;
            case 3 :
                this.position.x = this.width * this.sizeScale - this.width
                this.position.y = 0
            break;
        }
    }

    change( scale ) {
        this.sizeScale += scale * this.speed

        if (this.sizeScale > 1) {
            this.isOnOpen = false
            this.sizeScale = 1
            tickerUpdateRemove(this)
            if (this.readyCallback) this.readyCallback()
        }

        if (this.sizeScale < 0) {
            this.sizeScale = 0
            tickerUpdateRemove(this)
            UI.slidesContainer.removeChild(this)
            if (this.readyCallback) this.readyCallback(this)
            return
        }

        switch(this.side) {
            case 0 : this.position.y = this.height * this.sizeScale - this.height; break;
            case 1 : this.position.x = this.width - this.width * this.sizeScale; break;
            case 2 : this.position.y = this.height - this.height * this.sizeScale; break;
            case 3 : this.position.x = this.width * this.sizeScale - this.width; break;
        }
    }

    hide(callback) {
        this.readyCallback = callback
        tickerUpdateAdd(this)
    }

    tick( delta ) {
        if (this.isOnOpen) this.change(delta)
        else this.change(-delta)
    }
}

export default Slide

*/