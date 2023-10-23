import { TilingSprite, Container } from "pixi.js"
import { getAppScreen, tickerUpdateAdd, tickerUpdateRemove } from "../appScreen"
import { textureKeys } from "../assets"
import { getTexture } from "../loader"

const settings = {}
settings.scaleStep = 0.0003

class Background extends Container {
    constructor() {
        super()
        this.bgImage = new TilingSprite( getTexture(textureKeys.bgPixel) )
        this.bgImage.uvRespectAnchor = true
        this.bgImage.anchor.set(0.5)
        this.frontImage = new TilingSprite( getTexture(textureKeys.bgTile) )
        this.frontImage.uvRespectAnchor = true
        this.frontImage.anchor.set(0.5)
        this.frontImage.rotation = Math.PI
        this.backImage = new TilingSprite( getTexture(textureKeys.bgTile) )
        this.backImage.uvRespectAnchor = true
        this.backImage.anchor.set(0.5)
        this.addChild(this.bgImage, this.backImage, this.frontImage)
        this.resize( getAppScreen() )

        this.backImage.tileScale.x = this.backImage.tileScale.y = 0.75
        this.frontImage.tileScale.x = this.frontImage.tileScale.y = 0.5
    }

    resize(appScreen) {
        this.bgImage.width = this.frontImage.width = this.backImage.width = appScreen.width
        this.bgImage.height = this.frontImage.height = this.backImage.height = appScreen.height
        this.bgImage.position.x = this.frontImage.position.x = this.backImage.position.x = appScreen.centerX
        this.bgImage.position.y = this.frontImage.position.y = this.backImage.position.y = appScreen.centerY
    }

    setAnimation(isActive = true) {
        if (isActive) tickerUpdateAdd( this )
        else tickerUpdateRemove( this )
    }

    tick(delta) {
        const step = settings.scaleStep * delta

        const countImage = (image) => {
            image.tileScale.x = image.tileScale.y += step
            if (image.tileScale.x > 1) image.tileScale.x = image.tileScale.y = image.tileScale.x - 0.5

            if (image.tileScale.x > 0.75) image.alpha = (1 - image.tileScale.x) * 2
            else image.alpha = (image.tileScale.x - 0.5) * 2
        }

        countImage(this.backImage)
        countImage(this.frontImage)
    }
}

/*

bgS  0.75  0.8
bgA  0.75  0.7

frS  1     
frA  0.5

*/

/*
class Background extends TilingSprite {
    constructor() {
        super( getTexture(textureKeys.bgTile) )
        this.uvRespectAnchor = true
        this.anchor.set(0.5)
        this.resize( getAppScreen() )

        this.tileScale.x = this.tileScale.y = 0.5
        this.isTileScaleUp = true
        this.change()
    }

    resize(appScreen) {
        this.width = appScreen.width
        this.height = appScreen.height
        this.position.x = appScreen.centerX
        this.position.y = appScreen.centerY
    }

    change() {
        if (this.isTileScaleUp) {
            this.tileScale.x = this.tileScale.x = this.tileScale.y * 1.001
            if (this.tileScale >= 1) {
                this.tileScale = 1
                this.isTileScaleUp = false
            }
        } else {
            this.tileScale.x = this.tileScale.x = this.tileScale.y / 1.001
            if (this.tileScale <= 0.5) {
                this.tileScale = 0.5
                this.isTileScaleUp = true
            }
        }
        setTimeout(() => this.change(), 15)
    }
}
*/

export default Background