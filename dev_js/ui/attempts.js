import { Container, Sprite, Text } from "pixi.js"
import { textureKeys, soundKeys } from "../assets";
import { getTexture } from "../loader";
import { textStyles } from './textStyles'
import { playSound } from "../sound";

const settings = {}
settings.imageWidth = 280
settings.imageHeight = 320
settings.imageRate = settings.imageWidth / settings.imageHeight
settings.imageScreenRate = 7
settings.imageOffsetRate = 20

settings.textScreenRate = 10
settings.textSize = (settings.imageSize * settings.imageScreenRate) / settings.textScreenRate
settings.textOffsetRate = 3

class Attempts extends Container {
    constructor() {
        super()
        this.image = new Sprite( getTexture(textureKeys.attempts) )
        this.image.anchor.set( 1, 0 )
        this.addChild(this.image)
        this.text = new Text( 0, textStyles.attempts)
        this.text.anchor.set( 1, 0 )
        this.addChild(this.text)
    }

    resize(appScreen) {
        const spriteHeight = appScreen.minSize / settings.imageScreenRate
        
        this.image.height = spriteHeight > settings.imageHeight ? settings.imageHeight : spriteHeight
        this.image.width = this.image.height * settings.imageRate
        this.image.position.x = appScreen.width - appScreen.minSize / settings.imageOffsetRate
        this.image.position.y = appScreen.minSize / settings.imageOffsetRate

        const textSize = appScreen.minSize / settings.textScreenRate
        this.text.style.fontSize = textSize > settings.textSize ? settings.textSize : textSize
        const textOffset = (this.image.height - textSize) / settings.textOffsetRate
        this.text.position.x = this.image.position.x - textOffset - this.image.width
        this.text.position.y = textOffset + this.image.position.y
    }

    setText(attempts) {
        this.text.text = attempts
    }
}

export default Attempts