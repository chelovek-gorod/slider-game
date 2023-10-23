import { Container, Text } from "pixi.js"
import { textStyles } from './textStyles'

const settings = {
    textSize: 200,
    textScreenRate: 0.06,
    textOffsetRate: 0.11
}

class Counter extends Container {
    constructor() {
        super()
        this.text = new Text( '0 / 0', textStyles.counter )
        this.text.anchor.set( 0.5 )
        this.addChild(this.text)
    }

    resize(appScreen) {
        const textSize = appScreen.minSize * settings.textScreenRate
        this.text.style.fontSize = textSize > settings.textSize ? settings.textSize : textSize
        this.text.position.x = appScreen.width / 2
        this.text.position.y = appScreen.minSize * settings.textOffsetRate
    }

    setCount( slide, slides ) {
        this.text.text = `${slide} / ${slides}`
    }
}

export default Counter