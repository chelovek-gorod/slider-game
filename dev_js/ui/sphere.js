import { Sprite } from "pixi.js"
import { getAppScreen, tickerUpdateAdd, tickerUpdateRemove, removeSprite } from "../appScreen"
import { textureKeys } from "../assets"
import { getTexture } from "../loader"

const settings = {
    size: 128,
    maxSizeScreenRate: 0.1, // 10% 
    minSizeMaxSizeRate: 0.5, // half from max size
    minSpeedRate: 0.003,
    maxSpeedRate: 0.006,
    accelerationSpeed: 5
}

const spheresSprites = [
    textureKeys.sphereAqua,
    textureKeys.sphereBlue,
    textureKeys.sphereLime,
    textureKeys.spherePink,
    textureKeys.spherePurple,
]

function getSprite() {
    const i = Math.floor( Math.random() * spheresSprites.length )
    return getTexture(spheresSprites[i])
}

class Sphere extends Sprite {
    constructor() {
        super( getSprite() )
        this.anchor.set(0.5)
        this.screen = getAppScreen()
        this.reset()
        tickerUpdateAdd(this)
        this.alpha = 0.7

        this.accX = 0
        this.accY = 0

        this.eventMode = 'static';
        this.on('pointertap', () => {if(this.speed) this.speed *= 10})
    }

    reset() {
        this.speedRate = settings.minSpeedRate + Math.random() * (settings.maxSpeedRate - settings.minSpeedRate)
        this.speed = this.screen.minSize * this.speedRate

        let maxSize = this.screen.minSize * settings.maxSizeScreenRate
        if (maxSize > settings.size) maxSize = settings.size
        let minSize = maxSize * settings.minSizeMaxSizeRate
        this.size = this.width = this.height = minSize + Math.random() * (maxSize - minSize)

        this.direction = Math.random() * (Math.PI * 2)
        let isHorizontalSide = Math.random() < 0.5 ? true : false // true -> x = 0 || x = screen height
        let isTopOrLeftSide = Math.random() < 0.5 ? true : false
        this.position.x = isHorizontalSide ? Math.random() * this.screen.width : isTopOrLeftSide ? -this.size / 2 : this.screen.width + this.size / 2
        this.position.y = isHorizontalSide ? isTopOrLeftSide ? -this.size / 2 : this.screen.height + this.size / 2 : Math.random() * this.screen.height
        
        this.texture = getSprite()
    }

    resize(appScreen) {
        this.screen = appScreen
        this.checkVisibility()
    }

    checkVisibility() {
        if (this.position.x + this.size < 0 || this.position.x - this.size > this.screen.width
        || this.position.y + this.size < 0 || this.position.y - this.size > this.screen.height) {
            this.reset()
        }
    }

    tick(delta) {
        const path = delta * this.speed
        this.position.x += Math.cos(this.direction) * path
        this.position.y += Math.sin(this.direction) * path

        if (this.accX) this.position.x += this.accX * delta
        if (this.accY) this.position.y += this.accY * delta

        this.checkVisibility()
    }

    setAcceleration(direction) {
        switch(direction) {
            case 0 : this.accY = -settings.accelerationSpeed; break;
            case 1 : this.accX = settings.accelerationSpeed; break;
            case 2 : this.accY = settings.accelerationSpeed; break;
            case 3 : this.accX = -settings.accelerationSpeed; break;
            default: this.accX = this.accY = 0
        }
    }

    deactivate() {
        tickerUpdateRemove( this )
    }
}

export default Sphere