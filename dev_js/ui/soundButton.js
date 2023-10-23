import { Sprite } from "pixi.js"
import { getAppScreen } from "../appScreen"
import { textureKeys, soundKeys } from "../assets"
import { getTexture } from "../loader"
import { playSound, musicOn, musicOff, musicCheck } from "../sound"

const sprite = {}
sprite.width = 420
sprite.height = 320
sprite.widthRate = sprite.width / sprite.height
sprite.screenHeightRate = 1 / 7
sprite.offsetRate = 1 / 20

class SoundButton extends Sprite {
    constructor() {
        super( getTexture(textureKeys.musicOn) )
        this.anchor.set( 0, 1 )
        this.eventMode = 'static';
        this.isActive = false
        this.on('pointertap', this.onclick.bind(this))
    }

    resize(appScreen) {
        const height = appScreen.minSize * sprite.screenHeightRate
        this.height = height > sprite.height ? sprite.height : height
        this.width = this.height * sprite.widthRate

        const offset = appScreen.minSize * sprite.offsetRate
        this.position.x = offset
        this.position.y = appScreen.height - offset
    }

    onclick() {
        if (this.isActive) {
            this.isActive = false
            if (musicCheck()) {
                musicOff()
                this.texture = getTexture(textureKeys.musicOff)
            } else {
                musicOn()
                playSound(soundKeys.click)
                this.texture = getTexture(textureKeys.musicOn)
            }
            setTimeout(() => this.isActive = true, 0)
        }
    }

    setActivation(isActive = true) {
        this.isActive = isActive
    }
}

export default SoundButton