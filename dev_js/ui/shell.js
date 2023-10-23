import { Container, Graphics } from "pixi.js";

const settings = {
    shallFill: 0x000000,
    shallAlpha: 0.5,
}

class Shell extends Container {
    constructor() {
        super()
        this.eventMode = 'static'
        this.shell = new Graphics()
        this.addChild(this.shell)
    }

    resize(appScreen) {
        this.shell.clear()
        this.shell.beginFill(settings.shallFill, settings.shallAlpha)
        this.shell.drawRect(0, 0, appScreen.width, appScreen.height)
        this.shell.endFill()
    }
}

export default Shell