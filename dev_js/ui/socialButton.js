import { Sprite } from "pixi.js"
import { soundKeys, textureKeys } from "../assets"
import { getTexture } from "../loader"
import { playSound } from "../sound"
import { UI } from "./interface"

const sprite = {}
sprite.width = 400
sprite.height = 320
sprite.widthRate = sprite.width / sprite.height
sprite.screenHeightRate = 1 / 10
sprite.offsetRate = 1 / 20

class SocialButton extends Sprite {
    constructor() {
        super( getTexture(textureKeys.social) )
        this.anchor.set( 0.5, 1 )
        this.eventMode = 'static';
        this.isActive = false
        this.on('pointertap', this.onclick)
    }

    resize(appScreen) {
        const height = appScreen.minSize * sprite.screenHeightRate
        this.height = height > sprite.height ? sprite.height : height
        this.width = this.height * sprite.widthRate

        const offset = appScreen.minSize * sprite.offsetRate
        this.position.x = appScreen.centerX
        this.position.y = appScreen.height - offset * 1.2 
    }

    onclick() { 
        if (!this.isActive) return
        
        playSound(soundKeys.click)

        UI.showSocialPopup()
        this.isActive = false
        setTimeout(() => this.isActive = true, 1000)
    }

    setActivation(isActive = true) {
        this.isActive = isActive
    }
}

export default SocialButton