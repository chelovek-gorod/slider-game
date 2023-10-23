import { Container, Sprite, Text } from "pixi.js"
import { textureKeys, soundKeys } from "../assets"
import { getTexture } from "../loader"
import { textStyles } from './textStyles'
import { playSound } from "../sound"

const settings = {}
settings.imageSize = 320
settings.imageScreenRate = 7
settings.imageOffsetRate = 20

settings.textScreenRate = 10
settings.textSize = (settings.imageSize * settings.imageScreenRate) / settings.textScreenRate
settings.textOffsetRate = 3

class Score extends Container {
    constructor() {
        super()
        this.image = new Sprite( getTexture(textureKeys.scores) )
        this.image.anchor.set( 0, 0 )
        this.addChild(this.image)
        this.text = new Text( 0, textStyles.scores )
        this.addChild(this.text)
    }

    resize(appScreen) {
        const spriteSize = appScreen.minSize / settings.imageScreenRate
        
        this.image.width = this.image.height = spriteSize > settings.imageSize ? settings.imageSize : spriteSize
        this.image.position.x = appScreen.minSize / settings.imageOffsetRate
        this.image.position.y = appScreen.minSize / settings.imageOffsetRate

        const textSize = appScreen.minSize / settings.textScreenRate
        this.text.style.fontSize = textSize > settings.textSize ? settings.textSize : textSize
        const textOffset = (this.image.height - textSize) / settings.textOffsetRate
        this.text.position.x = textOffset + this.image.position.x + this.image.width
        this.text.position.y = textOffset + this.image.position.y
    }

    setText( scores ) {
        this.text.text = scores
    }
}

export default Score