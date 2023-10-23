import { Application } from 'pixi.js'
import constants from './constants'
import { playMusic, stopMusic } from './sound'



const app = new Application({
    background: 0xffffff,
    antialias: true, // сглаживание
    resolution: 2,
    resizeTo: window
})
document.body.append( app.view )

const appScreen = {}
resize()

function resize() {
    appScreen.width = app.screen.width
    appScreen.height = app.screen.height
    appScreen.centerX = app.screen.width / 2
    appScreen.centerY = app.screen.height / 2
    appScreen.minSize = app.screen.width > app.screen.height ? app.screen.height : app.screen.width

    app.stage.children.forEach( container => {
        container.children.forEach( element => {
            element.resize(appScreen)
        })
    })
}

export function getAppScreen() {
    return appScreen
}

export function screenAddContainer( container ) {
    app.stage.addChild(container)
}

export function screenRemoveContainer( container ) {
    app.stage.removeChild(container)
}

let orientation = window.matchMedia("(orientation: portrait)");
orientation.addEventListener("change", () => setTimeout(resize, 0))
window.addEventListener('resize', () => setTimeout(resize, 0))
window.addEventListener('focus', playMusic)
window.addEventListener('blur', stopMusic)

export function clearContainer( container ) {
    while(container.children[0]) {
        removeSprite( container.children[0] )
    }
}

export function removeSprite( sprite ) {
    sprite.parent.removeChild( sprite )
    sprite.destroy( {children : true} )
}

const stepAlpha = 1 / (constants.inOutTime / constants.tick)

export function smoothShowElement( element, side = null, callback = null ) {
    if (side) {
        switch(side) {
            case 'top' :
                element.smoothMove = {
                    isMovingVertical: true,
                    targetPosition: element.position.y,
                    step: (element.height / constants.inOutTime) * constants.tick
                }
                element.position.y -= element.height
            break;
            case 'bottom' :
                element.smoothMove = {
                    isMovingVertical: true,
                    targetPosition: element.position.y,
                    step: -((element.height / constants.inOutTime) * constants.tick)
                }
                element.position.y += element.height
            break;
            case 'left' :
                element.smoothMove = {
                    isMovingVertical: false,
                    targetPosition: element.position.x,
                    step: (element.width / constants.inOutTime) * constants.tick
                }
                element.position.x -= element.width
            break;
            case 'right' :
                element.smoothMove = {
                    isMovingVertical: false,
                    targetPosition: element.position.x,
                    step: -((element.width / constants.inOutTime) * constants.tick)
                }
                element.position.x -= element.width
            break;
            default: element.smoothMove = null
        }
    }

    element.alpha = 0
    app.stage.addChild(element)

    element.tick = (delta) =>{
        if(element.smoothMove) {
            if (element.smoothMove.isMovingVertical) {
                element.position.y += element.smoothMove.step * delta
            } else {
                element.position.x += element.smoothMove.step * delta
            }
        }

        element.alpha += stepAlpha * delta

        if (element.alpha >= 1) {
            if (element.smoothMove) {
                if (element.smoothMove.isMovingVertical) {
                    element.position.y = element.smoothMove.targetPosition
                } else {
                    element.position.x = element.smoothMove.targetPosition
                }
            }
            element.alpha = 1
            element.smoothMove = null
            tickerUpdateRemove( element )
            if (callback) callback()
        }
    }
    tickerUpdateAdd( element )
}

export function smoothHideElement( element, side = null, callback = null ) {
    if (side) {
        switch(side) {
            case 'top' :
                element.smoothMove = {
                    isMovingVertical: true,
                    targetPosition: element.position.y,
                    step: -((element.height / constants.inOutTime) * constants.tick)
                }
            break;
            case 'bottom' :
                element.smoothMove = {
                    isMovingVertical: true,
                    targetPosition: element.position.y,
                    step: (element.height / constants.inOutTime) * constants.tick
                }
            break;
            case 'left' :
                element.smoothMove = {
                    isMovingVertical: false,
                    targetPosition: element.position.x,
                    step: -((element.width / constants.inOutTime) * constants.tick)
                }
            break;
            case 'right' :
                element.smoothMove = {
                    isMovingVertical: false,
                    targetPosition: element.position.x,
                    step: (element.width / constants.inOutTime) * constants.tick
                }
            break;
            default: element.smoothMove = null
        }
    }

    element.tick = (delta) =>{
        if(element.smoothMove) {
            if (element.smoothMove.isMovingVertical) {
                element.position.y += element.smoothMove.step * delta
            } else {
                element.position.x += element.smoothMove.step * delta
            }
        }

        element.alpha -= stepAlpha * delta

        if (element.alpha <= 0) {
            if (element.smoothMove) {
                if (element.smoothMove.isMovingVertical) {
                    element.position.y = element.smoothMove.targetPosition
                } else {
                    element.position.x = element.smoothMove.targetPosition
                }
            }
            element.alpha = 0
            element.smoothMove = null
            tickerUpdateRemove( element )
            app.stage.removeChild(element)
            if (callback) callback()
        }
    }
    tickerUpdateAdd( element )
}

export function tickerUpdateAdd( element ) {
    tickerUpdateArr.push( element )
}

export function tickerUpdateRemove( element ) {
    tickerUpdateArr = tickerUpdateArr.filter( e => e !== element )
}

let tickerUpdateArr = [] // entities for update (need e.tick(delta) method)
app.ticker.add( delta => {
    // if (delta = 1) -> FPS = 60 (16.66ms per frame)
    tickerUpdateArr.forEach( element => element.tick(delta) )
})