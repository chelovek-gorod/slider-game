import { Sprite } from "pixi.js"
import { soundKeys } from "../assets"
import { playSound } from "../sound"
import { UI } from "./interface"

const sprite = {}
sprite.width = 380
sprite.height = 320
sprite.widthRate = sprite.width / sprite.height
sprite.screenHeightRate = 1 / 7
sprite.offsetRate = 1 / 20

class ResultsButton extends Sprite {
    constructor(image) {
        super( image )
        this.anchor.set( 1, 1 )
        this.eventMode = 'static';
        this.isActive = false
        this.on('pointertap', this.onclick)
    }

    resize(appScreen) {
        const height = appScreen.minSize * sprite.screenHeightRate
        this.height = height > sprite.height ? sprite.height : height
        this.width = this.height * sprite.widthRate

        const offset = appScreen.minSize * sprite.offsetRate
        this.position.x = appScreen.width - offset
        this.position.y = appScreen.height - offset
    }

    onclick() { 
        if (!this.isActive) return

        playSound(soundKeys.click)
        UI.resultsClicked()
        this.isActive = false
        setTimeout(() => this.isActive = true, 1000)
    }

    setImage(image) {
        this.texture = image
    }

    setActivation(isActive = true) {
        this.isActive = isActive
    }
}

export default ResultsButton