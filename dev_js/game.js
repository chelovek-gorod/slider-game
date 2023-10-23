import { Container } from 'pixi.js'
import constants from './constants'
import { smoothShowElement, getAppScreen, screenAddContainer, smoothHideElement, clearContainer } from './appScreen'
import Background from './ui/background'
import { UI, initInterface } from './ui/interface'
import { startMusic, playSound } from './sound'
import Slide from './ui/slide';
import { soundKeys } from './assets'
import Yandex from './yandex'
import Sphere from './ui/sphere'

const startState = {
    level: 0,
    helps: 8,
    score: 0,
    attempts: 3,
    slides: {
        open: 0,
        all: 0,
        count: 0, // if count = 0 -> all++, count = all
    }
}

let state = {...startState, slides: {...startState.slides}}

export function isGameStarted() {
    if (state && state.level) return true
}

let background = null

export function initGame() {
    initInterface() 

    const BG = new Container()
    background = new Background()
    BG.addChild( background )
    smoothShowElement(BG, 'center', backgroundReady)
    background.setAnimation()

    function backgroundReady() {
        screenAddContainer(UI.slidesContainer)
        screenAddContainer(UI.spheresContainer)
        UI.showStartTopContainer()
        UI.showBottomContainer()
        UI.showCenterButtonContainer( UI.startButton )
    }
}

let isFirstStart = true

export function startGame() {
    if (isFirstStart) {
        isFirstStart = false
        startMusic()
        UI.showGameTopContainer(nextLevel)
    } else {
        setTimeout(nextLevel, constants.startLevelDelay)
    }

    state = {...startState, slides: {...startState.slides}}

    UI.score.setText(state.score)
    UI.attempts.setText(state.attempts)
}

function fillSpheres() {
    screenAddContainer(UI.spheresContainer)
    UI.spheresContainer.alpha = 1
    const spheres = 2 + Math.floor(state.level / 3)
    for(let i = 0; i < spheres; i++)
        UI.spheresContainer.addChild( new Sphere() )
}

function moveSpheres(side) {
    UI.spheresContainer.children.forEach( sphere => sphere.setAcceleration(side) )
}

function clearSpheres() {
    UI.spheresContainer.children.forEach( sphere => sphere.deactivate() )
    clearContainer( UI.spheresContainer )
}

function updateStateBeforeNextLevel() {
    state.level++
    if (state.slides.count > 1) state.slides.count--
    else state.slides.count = ++state.slides.all
}

function openSlide( callback ) {
    state.slides.open++
    UI.counter.setCount( state.slides.open, state.slides.all )
    new Slide(getAppScreen(), ()=> {
        if (state.slides.open === 1) background.setAnimation(false)
        if (state.slides.open === state.slides.all) {
            fillSpheres()
            callback()
        }
        else openSlide( callback )
    })
}

export function nextLevel() {
    updateStateBeforeNextLevel()
    UI.counter.setCount( state.slides.open, state.slides.all )
    setTimeout(() => {
        openSlide(() => UI.showControllerContainer(controllerReady) )
    }, constants.startLevelDelay)
}

function controllerReady() {
    UI.controller.setActivation()
    if (state.helps) {
        state.helps--
        UI.controller.setHelp( getLastSlide().side )
    }
}

function getLastSlide() {
    if (UI.slidesContainer.children.length === 0) return null

    const slides = UI.slidesContainer.children
    return slides[slides.length - 1]
}

export function controllerClicked(side) {
    const slide = getLastSlide()
    if(slide === null) return

    if (side === slide.side) {
        UI.controller.setActivation(false)
        if (UI.controller.help) UI.controller.removeHelp()
        playSound(soundKeys.true)

        state.score++
        addScoreToYandex()
        UI.score.setText(state.score)

        state.slides.open--
        UI.counter.setCount( state.slides.open, state.slides.all )
        if(state.slides.open === 0) {
            background.setAnimation()
            smoothHideElement(UI.spheresContainer, 'center', clearSpheres)
            UI.hideControllerContainer()
        }

        slide.hide(slideClosed)
        moveSpheres(side)

        
    } else {
        const isWrongClick = UI.controller.block(side)
        if (isWrongClick) {
            if (state.attempts > 0) {
                playSound(soundKeys.false)
                state.attempts--
                UI.attempts.setText(state.attempts)
            } else {
                background.setAnimation()
                UI.controller.setActivation(false)
                playSound(soundKeys.lose)
                UI.counter.setCount(0, 0)
                UI.slidesContainer.children.forEach( slide => slide.hide(null) )
                UI.hideControllerContainer(() => {
                    setTimeout(showResults, constants.startLevelDelay)
                    clearSpheres()
                })
            }
        } else {
            playSound(soundKeys.click)
        }
    }
}

export function addScoreToYandex() {
    if (Yandex && state.score) Yandex.setNewResult(state.score)
}

function slideClosed() {
    //state.slides.open--
    //UI.counter.setCount( state.slides.open, state.slides.all )
    moveSpheres(false)

    if (state.slides.open) {
        controllerReady()
    }
    else {
        //smoothHideElement(UI.spheresContainer, 'center', clearSpheres)
        //UI.hideControllerContainer(levelEnd)
        levelEnd()
    }
}

function levelEnd() {
    state.attempts++
    UI.attempts.setText(state.attempts)
    playSound(soundKeys.clear)

    console.log(state.level)

    if (Yandex && state.level > 5) {
        setTimeout(() => {
            Yandex.showBannerAd( () => UI.showCenterButtonContainer( UI.continueButton ) )
        }, 600)
    }
    else UI.showCenterButtonContainer( UI.continueButton )
}

function showResults() {
    setTimeout(() => {
        state.level = 0 // for activate keyboard actions
        UI.showCenterButtonContainer( UI.startButton )
        UI.resultsClicked()
    }, constants.startLevelDelay)
}