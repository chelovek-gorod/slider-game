import { Sprite } from "pixi.js"
import { getAppScreen } from "../appScreen"
import { UI } from "./interface"
import { textureKeys, soundKeys } from "../assets"
import { getTexture } from "../loader"
import { playSound } from "../sound"

const sprite = {
    width: 320,
    height: 320,
    screenRate: 1 / 7,
    offsetRate: 1 / 20
}

class Language extends Sprite {
    constructor(isLangRu) {
        super( getTexture( isLangRu ? textureKeys.langRu : textureKeys.langEn ) )
        this.anchor.set( 1, 0 )
        this.eventMode = 'static';
        this.isActive = false
        this.on('pointertap', this.onclick.bind(this))
    }

    resize(appScreen) {
        const size = appScreen.minSize * sprite.screenRate
        if (size > sprite.width) {
            this.width = sprite.width
            this.height = sprite.height
        } else {
            this.width = size
            this.height = size
        }
        const offset = appScreen.minSize * sprite.offsetRate
        this.position.x = appScreen.width - offset
        this.position.y = offset
    }

    onclick() {
        if (this.isActive) {
            this.isActive = false
            playSound(soundKeys.click)
            UI.changeLanguage()
            setTimeout(() => this.isActive = true, 0)
        }
    }

    setImage(image) {
        this.texture = image
    }

    setActivation(isActive = true) {
        this.isActive = isActive
    }
}

export default Language