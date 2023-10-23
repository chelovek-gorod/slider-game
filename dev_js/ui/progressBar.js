import { Container, Graphics, Text } from 'pixi.js'
import { getAppScreen } from '../appScreen'
import { textStyles } from './textStyles'

const settings = {
    width: 300,
    height: 30,
    backgroundColor: 0xCCCCCC,
    fillColor: 0x999999,
    textColor: 0x000000,
}

class ProgressBar extends Container {
    constructor (text) {
        super()
        this.resize( getAppScreen() )

        this.progressMask = new Graphics()
        this.progressMask.beginFill()
        this.progressMask.drawRoundedRect( 0, 0, settings.width, settings.height, settings.height / 2 /* rounding size */ )
        this.progressMask.endFill()
        this.addChild( this.progressMask )

        this.container = new Container()
        this.container.mask = this.progressMask
        this.addChild( this.container )

        this.background = new Graphics()
        this.background.beginFill( settings.backgroundColor, 1 )
        this.background.drawRect( 0, 0, settings.width, settings.height )
        this.background.endFill()
        this.container.addChild( this.background )
        
        this.fill = new Graphics()
        this.fill.beginFill( settings.fillColor, 1 )
        this.fill.drawRect( 0, 0, settings.width, settings.height )
        this.fill.endFill()
        this.fill.scale.set(0, 1) /* scaleX = 0, scaleY = 1 */
        this.container.addChild( this.fill )
        
        this.text = new Text( text, textStyles.loading )
        this.text.anchor.set( 0.5 )
        this.text.position.x = settings.width / 2
        this.text.position.y = settings.height / 2
        this.container.addChild( this.text )
    }

    upload( progress, text ) {
        this.fill.scale.set( progress / 100, 1 )
        this.text.text = text
    }

    resize(appScreen) {
        this.position.x = appScreen.centerX - (settings.width / 2)
        this.position.y = appScreen.centerY - (settings.height / 2)
    }
}

export default ProgressBar