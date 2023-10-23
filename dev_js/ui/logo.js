import { Sprite } from "pixi.js"
import { getAppScreen } from "../appScreen"
import { textureKeys, soundKeys } from "../assets"
import { getTexture } from "../loader"
import { playSound } from "../sound"

const logo = {}
logo.width = 600
logo.height = 280
logo.widthRate = logo.width / logo.height
logo.screenHeightRate = 1 / 7
logo.offsetRate = 1 / 20

class Logo extends Sprite {
    constructor() {
        super( getTexture( textureKeys.marsGame ) )
        this.anchor.set( 0, 0 )
        this.eventMode = 'static';
        this.isActive = false
        this.on('pointertap', this.onclick)
    }

    resize(appScreen) {
        const height = appScreen.minSize * logo.screenHeightRate
        this.height = height > logo.height ? logo.height : height
        this.width = this.height * logo.widthRate

        this.position.x = appScreen.minSize * logo.offsetRate
        this.position.y = appScreen.minSize * logo.offsetRate
    }

    onclick() {
        if (this.isActive) {
            playSound(soundKeys.click)
            window.open('https://yandex.ru/games/developer?name=mars%20game', '_blank')
        }
    }

    setActivation(isActive = true) {
        this.isActive = isActive
    }
}

export default Logo