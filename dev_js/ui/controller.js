import { Container, Graphics, Sprite } from "pixi.js"
import { textureKeys } from "../assets";
import { getTexture } from "../loader";
import { tickerUpdateAdd, tickerUpdateRemove } from '../appScreen'
import { controllerClicked } from '../game'

const settings = {
    size: 832,
    halfSize: 416,
    screenK: 2,

    upAnchor:    {x: 1, y: 1},
    rightAnchor: {x: 1, y: 1},
    downAnchor:  {x: 1, y: 1},
    leftAnchor:  {x: 1, y: 1},
}

function sendClick(side) {
    if (controller && controller.isActive) {
        switch(side) {
            case 0 : if (controller.up.isActive) return controllerClicked(side);
            case 1 : if (controller.right.isActive) return controllerClicked(side);
            case 2 : if (controller.down.isActive) return controllerClicked(side);
            case 3 : if (controller.left.isActive) return controllerClicked(side);
        }
    }
}

let controller = null

document.addEventListener('keyup', (key) => {
    switch(key.code) {
        case 'ArrowUp' :
        case 'KeyW' :
        case 'Numpad8' : sendClick(0); break;

        case 'ArrowRight' :
        case 'KeyD' :
        case 'Numpad6' : sendClick(1); break;

        case 'ArrowDown' :
        case 'KeyS' :
        case 'Numpad2' : sendClick(2); break;

        case 'ArrowLeft' :
        case 'KeyA' :
        case 'Numpad4' : sendClick(3); break;
    }
})

class Controller extends Container {
    constructor() {
        super()
        this.isActive = false
        this.up = new Sprite( getTexture(textureKeys.arrow) )
        this.right = new Sprite( getTexture(textureKeys.arrow) )
        this.down = new Sprite( getTexture(textureKeys.arrow) )
        this.left = new Sprite( getTexture(textureKeys.arrow) )

        this.up.bg = new Sprite( getTexture(textureKeys.arrowBg) )
        this.right.bg = new Sprite( getTexture(textureKeys.arrowBg) )
        this.down.bg = new Sprite( getTexture(textureKeys.arrowBg) )
        this.left.bg = new Sprite( getTexture(textureKeys.arrowBg) )
        
        this.up.anchor.set(settings.upAnchor.x, settings.upAnchor.y)
        this.right.anchor.set(settings.rightAnchor.x, settings.rightAnchor.y)
        this.down.anchor.set(settings.downAnchor.x, settings.downAnchor.y)
        this.left.anchor.set(settings.leftAnchor.x, settings.leftAnchor.y)

        this.up.bg.anchor.set(settings.upAnchor.x, settings.upAnchor.y)
        this.right.bg.anchor.set(settings.rightAnchor.x, settings.rightAnchor.y)
        this.down.bg.anchor.set(settings.downAnchor.x, settings.downAnchor.y)
        this.left.bg.anchor.set(settings.leftAnchor.x, settings.leftAnchor.y)

        this.right.rotation = Math.PI * 0.5
        this.down.rotation = Math.PI
        this.left.rotation = Math.PI * 1.5

        this.right.bg.rotation = Math.PI * 0.5
        this.down.bg.rotation = Math.PI
        this.left.bg.rotation = Math.PI * 1.5

        this.up.eventMode = 'static'
        this.right.eventMode = 'static'
        this.down.eventMode = 'static'
        this.left.eventMode = 'static'

        this.up.on('pointertap', () => sendClick(0) )
        this.right.on('pointertap', () => sendClick(1) )
        this.down.on('pointertap', () => sendClick(2) )
        this.left.on('pointertap', () => sendClick(3) )
        this.up.isActive = false
        this.right.isActive = false
        this.down.isActive = false
        this.left.isActive = false
        this.stub = new Graphics()
        this.stub.eventMode = 'static'
        this.addChild(this.up.bg, this.right.bg, this.down.bg, this.left.bg)
        this.addChild(this.up, this.right, this.down, this.left)
        this.addChild(this.stub)
        this.rotation = Math.PI / 4

        this.help = null
        this.isAddAlpha = false
        this.stepAlpha = 0.021

        controller = this
    }

    resize(appScreen) {
        const size = appScreen.minSize / settings.screenK
        const scale = (size > settings.size) ? 1 : size / settings.size
        this.position.x = appScreen.centerX
        this.position.y = appScreen.centerY

        this.stub.clear()
        this.stub.beginFill(0xffffff, 0.0001)
        this.stub.arc(0, 0, settings.halfSize * scale * 0.3, 0, Math.PI * 2)
        this.stub.endFill()

        this.up.width = this.up.height = this.up.bg.width = this.up.bg.height = settings.halfSize * scale
        this.right.width = this.right.height = this.right.bg.width = this.right.bg.height = settings.halfSize * scale
        this.down.width = this.down.height = this.down.bg.width = this.down.bg.height = settings.halfSize * scale
        this.left.width = this.left.height = this.left.bg.width = this.left.bg.height = settings.halfSize * scale

        this.up.position.x = this.up.position.y = this.up.bg.position.x = this.up.bg.position.y = 0
        this.right.position.x = this.right.position.y = this.right.bg.position.x = this.right.bg.position.y = 0
        this.down.position.x = this.down.position.y = this.down.bg.position.x = this.down.bg.position.y = 0
        this.left.position.x = this.left.position.y = this.left.bg.position.x = this.left.bg.position.y = 0
    }

    setHelp( side ) {
        switch(side) {
            case 0 : this.help = this.up; break;
            case 1 : this.help = this.right; break;
            case 2 : this.help = this.down; break;
            case 3 : this.help = this.left; break;
            default: return
        }
        this.isAddAlpha = true
        tickerUpdateAdd(this)
    }

    removeHelp() {
        tickerUpdateRemove(this)
        this.help.alpha = 1
        this.help = null
    }

    tick( delta ) {
        if(this.isAddAlpha) {
            this.help.alpha -= this.stepAlpha * delta
            if (this.help.alpha <= 0) this.isAddAlpha = false
        } else {
            this.help.alpha += this.stepAlpha * delta
            if (this.help.alpha >= 1) this.isAddAlpha = true
        }
    }

    block(side) {
        let key = null
        switch(side) {
            case 0 : key = this.up; break;
            case 1 : key = this.right; break;
            case 2 : key = this.down; break;
            case 3 : key = this.left; break;
        }
        if (key) {
            if (key.isActive) {
                key.isActive = false
                key.alpha = 0
                key.bg.texture = getTexture(textureKeys.arrowBgWrong)
                return true
            } else {
                return false
            }
        }
    }

    setActivation(isActive = true) {
        this.isActive = isActive
        this.up.isActive = this.right.isActive = this.down.isActive = this.left.isActive = isActive
        this.up.alpha = this.right.alpha = this.down.alpha = this.left.alpha = 1
        this.up.bg.texture = this.right.bg.texture = this.down.bg.texture = this.left.bg.texture = getTexture(textureKeys.arrowBg)
    }
}

export default Controller