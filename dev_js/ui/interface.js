import { Container } from 'pixi.js'
import { getAppScreen, smoothShowElement, smoothHideElement } from '../appScreen'
import { soundKeys, textureKeys } from "../assets"
import { getTexture } from '../loader'
import LoginPopup from './LoginPopup'
import Yandex from '../yandex'
import Button from './Button'
import Language from './language'
import Logo from './logo'
import ResultsButton from './resultsButton'
import SoundButton from './soundButton'
import { playSound } from '../sound'
import Shell from './shell'
import ResultsPopup from './ResultsPopup'
import Score from './score'
import Counter from './counter'
import Attempts from './attempts'
import Controller from './controller'
import { startGame, nextLevel, addScoreToYandex, isGameStarted } from '../game'
import SocialButton from './socialButton'
import SocialPopup from './socialPopup'

const lang = navigator.language || navigator.userLanguage

class UserInterface {
    constructor() {
        this.isLangRu = !!(~lang.indexOf('ru'))
        
        this.slidesContainer = new Container()
        this.spheresContainer = new Container()
        this.startTopContainer = new Container()
        this.gameTopContainer = new Container()
        this.BottomContainer = new Container()
        this.centerButtonContainer = new Container()
        this.controllerContainer = new Container()
        this.shellContainer = new Container()
        this.popupContainer = new Container()

        this.logoButton = new Logo()
        this.languageButton = new Language(this.isLangRu)
        this.startTopContainer.addChild(this.logoButton)
        this.startTopContainer.addChild(this.languageButton)

        this.soundButton = new SoundButton()
        this.socialButton = new SocialButton()
        const resultButtonTexture = (!Yandex || !Yandex.isPlayerAuthorized) ? textureKeys.resultsOff : textureKeys.resultsOn
        this.resultsButton = new ResultsButton( getTexture(resultButtonTexture) )
        this.BottomContainer.addChild(this.soundButton)
        this.BottomContainer.addChild(this.socialButton)
        this.BottomContainer.addChild(this.resultsButton)

        const startButtonImage = getTexture( this.isLangRu ? textureKeys.startRu : textureKeys.startEn )
        //                             image,     scaleWidth,   anchor,  callback, offset = null
        this.startButton = new Button( startButtonImage, 0.5, 'center', this.startGameClicked.bind(this), {x: 0.5, y: 0.5} )

        const continueButtonImage = getTexture( this.isLangRu ? textureKeys.continueRu : textureKeys.continueEn )
        //                                image,        scaleWidth,   anchor,            callback, offset = null
        this.continueButton = new Button( continueButtonImage, 0.5, 'center', this.continueGameClicked.bind(this), {x: 0.5, y: 0.5} )

        this.score = new Score()
        this.gameTopContainer.addChild(this.score)

        this.counter = new Counter()
        this.gameTopContainer.addChild(this.counter)

        this.attempts = new Attempts()
        this.gameTopContainer.addChild(this.attempts)

        this.controller = new Controller()
        this.controllerContainer.addChild(this.controller)

        this.shell = new Shell()
        this.shellContainer.addChild(this.shell)

        this.loginPopup = new LoginPopup(this.isLangRu)
        this.resultsPopup = new ResultsPopup(this.isLangRu)
        this.socialPopup = new SocialPopup(this.isLangRu)
    }

    changeAuthState( isAuth ) {
        if (isAuth) {
            this.resultsButton.setImage( getTexture(textureKeys.resultsOn) )
            // if authorized after game over
            addScoreToYandex()
        }
    }

    changeLanguage() {
        this.isLangRu = !this.isLangRu
        console.log('this.isLangRu', this.isLangRu)
        this.languageButton.setImage( getTexture( this.isLangRu ? textureKeys.langRu : textureKeys.langEn ) )
        this.startButton.setImage( getTexture( this.isLangRu ? textureKeys.startRu : textureKeys.startEn ) )
        this.continueButton.setImage( getTexture( this.isLangRu ? textureKeys.continueRu : textureKeys.continueEn ) )
        this.loginPopup.loginButton.setImage( getTexture( this.isLangRu ? textureKeys.loginRu : textureKeys.loginEn ) )
        this.loginPopup.cancelButton.setImage( getTexture( this.isLangRu ? textureKeys.cancelRu : textureKeys.cancelEn ) )
        this.loginPopup.changeText(this.isLangRu)
        this.resultsPopup.changeText(this.isLangRu)
        this.socialPopup.changeText(this.isLangRu)
    }

    showStartTopContainer() {
        const appScreen = getAppScreen()
        this.startTopContainer.children.forEach( element => element.resize(appScreen) )
        smoothShowElement(this.startTopContainer, 'top', () => {
            this.startTopContainer.children.forEach( element => element.setActivation() )
        })
    }

    hideStartTopContainer( callback ) {
        this.startTopContainer.children.forEach( element => element.setActivation(false) )
        smoothHideElement(this.startTopContainer, 'top', () => {
            if (callback) callback()
        }) 
    }

    showBottomContainer() {
        const appScreen = getAppScreen()
        this.BottomContainer.children.forEach( element => element.resize(appScreen) )
        smoothShowElement(this.BottomContainer, 'bottom', () => {
            this.BottomContainer.children.forEach( element => element.setActivation() )
        })
    }

    showCenterButtonContainer( button ) {
        const appScreen = getAppScreen()
        button.resize(appScreen)
        this.centerButtonContainer.addChild(button)
        smoothShowElement(this.centerButtonContainer, 'center', () => {
            button.setActivation()
            this.resultsButton.setActivation()
            this.socialButton.setActivation()
        })
    }

    hideCenterButtonContainer( callback ) {
        smoothHideElement(this.centerButtonContainer, 'center', () => {
            const button = this.centerButtonContainer.children[0]
            this.centerButtonContainer.removeChild(button)
            this.resultsButton.setActivation(false)
            this.socialButton.setActivation(false)
            if (callback) callback()
        })
    }

    showGameTopContainer(callback) {
        const appScreen = getAppScreen()
        this.gameTopContainer.children.forEach( element => element.resize(appScreen) )
        smoothShowElement(this.gameTopContainer, 'top', () => {
            if (callback) callback()
        })
    }

    hideGameTopContainer() {
        smoothHideElement(this.gameTopContainer, 'top')
    }

    showControllerContainer( callback ) {
        const appScreen = getAppScreen()
        this.controller.resize(appScreen)
        smoothShowElement(this.controllerContainer, 'center', () => {
            this.controller.setActivation()
            this.resultsButton.setActivation()
            this.socialButton.setActivation()
            if (callback) callback()
        })
    }

    hideControllerContainer( callback ) {
        this.controller.setActivation(false)
        this.resultsButton.setActivation(false)
        this.socialButton.setActivation(false)
        smoothHideElement(this.controllerContainer, 'center', () => {
            if (callback) callback()
        })
    }

    startGameClicked() {
        playSound(soundKeys.start)
        this.hideStartTopContainer()
        this.hideCenterButtonContainer(startGame)
    }
    
    continueGameClicked() {
        playSound(soundKeys.start)
        this.hideCenterButtonContainer(nextLevel)
    }

    resultsClicked() {
        if (!Yandex) return 
        if (Yandex.isPlayerAuthorized) this.showResultsPopup()
        else this.showLoginPopup()
    }

    showShell(appScreen) {
        this.shell.resize(appScreen)
        smoothShowElement(this.shellContainer, 'center')
    }

    hideShell() {
        smoothHideElement(this.shellContainer, 'center')
    }

    showLoginPopup() {
        const appScreen = getAppScreen()

        this.showShell(appScreen)
        
        this.loginPopup.resize(appScreen)
        this.popupContainer.addChild(this.loginPopup)
        smoothShowElement( this.popupContainer, 'top', () => this.loginPopup.setActivation() )
    }

    hideLoginPopup() {
        smoothHideElement(this.popupContainer, 'top', () => {
            this.popupContainer.position.y = 0
            this.popupContainer.removeChild(this.loginPopup)
        })
        this.hideShell()
    }

    showResultsPopup() {
        const appScreen = getAppScreen()

        this.showShell(appScreen)
        this.resultsPopup.resize(appScreen)
        this.popupContainer.addChild(this.resultsPopup)
        smoothShowElement( this.popupContainer, 'top', () => this.resultsPopup.setActivation() )

        Yandex.fetchResults( results => { console.log('RESULTS', results)
            if (results) this.resultsPopup.fillResults(results)
            else console.log('RESULTS IS NOT EXIST')
        })
    }

    hideResultsPopup() {
        smoothHideElement(this.popupContainer, 'top', () => {
            this.popupContainer.position.y = 0
            this.popupContainer.removeChild(this.resultsPopup)
        })
        this.hideShell()
    }

    showSocialPopup() {
        const appScreen = getAppScreen()

        this.showShell(appScreen)
        this.socialPopup.resize(appScreen)
        this.popupContainer.addChild(this.socialPopup)
        smoothShowElement( this.popupContainer, 'bottom', () => this.socialPopup.setActivation() )
    }

    hideSocialPopup() {
        smoothHideElement(this.popupContainer, 'bottom', () => {
            this.popupContainer.position.y = 0
            this.popupContainer.removeChild(this.socialPopup)
        })
        this.hideShell()
    }

    startLoginClicked() {
        this.hideLoginPopup()
        Yandex.fetchAuthorization( isAuth => this.changeAuthState( isAuth ) )
    }

    cancelLoginClicked() {
        this.hideLoginPopup()
    }
}

export let UI = null

export function initInterface() {
    if (UI) return UI

    UI = new UserInterface()
}

document.addEventListener('keyup', (key) => {
    if (!UI || UI.centerButtonContainer.alpha < 1 || UI.popupContainer.children.length) return

    let action
    const isGame = isGameStarted()
    if (UI.startButton.isActive && !isGame) action = UI.startGameClicked.bind(UI)
    else if (UI.continueButton.isActive && isGame) action = UI.continueGameClicked.bind(UI)
    else return

    switch(key.code) {
        case 'Numpad5' :
        case 'NumpadEnter' :
        case 'Space' :
        case 'Enter' : action(); break;
    }
    console.log(key.code)
})