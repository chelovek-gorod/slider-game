import { Sprite } from "pixi.js"

const BUTTON = {}
BUTTON.imageWidth = 680
BUTTON.imageHeight = 260
BUTTON.buttonWidth = 616
BUTTON.buttonHeight = 196
BUTTON.topOffset = 16
BUTTON.leftOffset = 32
/*
BUTTON.imageWidth = 866
BUTTON.imageHeight = 380
BUTTON.buttonWidth = 730
BUTTON.buttonHeight = 243
BUTTON.topOffset = 58
BUTTON.leftOffset = 68
*/
BUTTON.bottomOffset = BUTTON.imageHeight - BUTTON.topOffset - BUTTON.buttonHeight
BUTTON.rightOffset = BUTTON.imageWidth - BUTTON.leftOffset - BUTTON.buttonWidth
BUTTON.widthDivHeightRate = BUTTON.imageWidth / BUTTON.imageHeight
BUTTON.widthRate = 1 / BUTTON.imageWidth
BUTTON.heightRate = 1 / BUTTON.imageHeight

BUTTON.anchor = {}

BUTTON.anchor.topLeft = {x: BUTTON.widthRate * BUTTON.leftOffset, y: BUTTON.heightRate * BUTTON.topOffset}
BUTTON.anchor.topRight = {x: BUTTON.widthRate * (BUTTON.imageWidth - BUTTON.rightOffset), y: BUTTON.anchor.topLeft.y}
BUTTON.anchor.bottomLeft = {x: BUTTON.anchor.topLeft.x, y: BUTTON.heightRate * (BUTTON.imageHeight - BUTTON.bottomOffset)}
BUTTON.anchor.bottomRight = {x: BUTTON.anchor.topRight.x, y: BUTTON.anchor.bottomLeft.y}

BUTTON.anchor.center = {
    x: BUTTON.widthRate * (BUTTON.leftOffset + BUTTON.buttonWidth / 2),
    y: BUTTON.heightRate * (BUTTON.topOffset + BUTTON.buttonHeight / 2),
}

BUTTON.anchor.centerTop = {x: BUTTON.anchor.center.x, y: BUTTON.anchor.topLeft.y}
BUTTON.anchor.centerBottom = {x: BUTTON.anchor.center.x, y: BUTTON.anchor.bottomLeft.y}
BUTTON.anchor.centerRight = {x: BUTTON.anchor.topRight.x, y: BUTTON.anchor.center.y}
BUTTON.anchor.centerLeft = {x: BUTTON.anchor.topLeft.x, y: BUTTON.anchor.center.y}

class Button extends Sprite {
    constructor(image, scaleWidth, anchor, callback, offset = null) {
        super(image)
        this.scaleWidth = scaleWidth
        if (anchor in BUTTON.anchor) {
            this.anchor.set(BUTTON.anchor[anchor].x, BUTTON.anchor[anchor].y)
        } else {
            this.anchor.set(BUTTON.anchor.center.x, BUTTON.anchor.center.y)
        }
        this.offset = offset
        this.callback = callback
        this.eventMode = 'static';
        this.isActive = false
        this.on('pointertap', this.onclick.bind(this))
    }

    resize( parentContainer ) {
        const rate = (this.scaleWidth * parentContainer.minSize) / BUTTON.buttonWidth
        this.width = rate < 1 ? BUTTON.imageWidth * rate : BUTTON.imageWidth
        this.height = rate < 1 ? BUTTON.imageHeight * rate : BUTTON.imageHeight
        if (this.offset) {
            this.position.x = parentContainer.width * this.offset.x
            this.position.y = parentContainer.height * this.offset.y
        }
    }

    setImage(image) {
        this.texture = image
    }

    setActivation(isActive = true) {
        this.isActive = isActive
    }

    onclick() {
        if (this.isActive) {
            this.isActive = false
            if (this.callback) this.callback()
        }
    }
}

export default Button