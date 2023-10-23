import { Container, Graphics, Text } from "pixi.js";
import { textureKeys, soundKeys } from "../assets";
import { getTexture } from "../loader";
import { textStyles } from './textStyles'
import { playSound } from "../sound";
import Button from "./Button";
import { UI } from "./interface";

const settings = {
    sizeRate: 0.8,
    fill: 0xffffff,
    radius: 0.05,
    borderSizeRate: 0.01,
    borderFill: "#505f68",
    alpha: 0.7,

    textBgSizeRate: 0.7,
    textBgHeightRate: 0.575,
    textBgRadius: 0.025,
    textBgFill: 0xeeeeee,

    textFontSizeRate: 0.055,
    textWidthRate: 0.6,
    textRu: 'Для просмотра рекордов, а также для добавления своего результата в таблицу рекордов необходимо авторизоваться.\n\nЖелаете войти?',
    textEn: 'To view the leaderboard, and to add your result to the leaderboard, you need to log in.\n\nDo you want to log in?',

    buttonWidthRate: 0.3,
    buttonCancelOffsetX: 0.05,
    buttonLoginOffsetX: 0.95,
    buttonOffsetY: 0.95,
}

class LoginPopup extends Container {
    constructor(isLangRu) {
        super()
        this.rectBg = new Graphics()
        this.addChild(this.rectBg)

        this.textBg = new Graphics()
        this.addChild(this.textBg)

        this.text = new Text( isLangRu ? settings.textRu : settings.textEn, textStyles.message )
        this.addChild(this.text)

        this.isActive = false

        const loginButtonImage = getTexture( isLangRu ? textureKeys.loginRu : textureKeys.loginEn )
        const loginButtonOffset = {x: settings.buttonLoginOffsetX, y: settings.buttonOffsetY}
        this.loginButton = new Button(
            loginButtonImage, settings.buttonWidthRate, 'bottomRight', this.onClick.bind(this, true), loginButtonOffset)
        this.addChild(this.loginButton)

        const cancelButtonImage = getTexture( isLangRu ? textureKeys.cancelRu : textureKeys.cancelEn )
        const cancelButtonOffset = {x: settings.buttonCancelOffsetX, y: settings.buttonOffsetY}
        this.cancelButton = new Button(
            cancelButtonImage, settings.buttonWidthRate, 'bottomLeft', this.onClick.bind(this, false), cancelButtonOffset)
        this.addChild(this.cancelButton)
    }

    resize(appScreen) {
        const size = appScreen.minSize * settings.sizeRate
        this.position.x = (appScreen.width - size) / 2
        this.position.y = (appScreen.height - size) / 2

        this.rectBg.clear()
        this.rectBg.lineStyle(size * settings.borderSizeRate, settings.borderFill, 1)
        this.rectBg.beginFill(settings.fill, settings.alpha)
        this.rectBg.drawRoundedRect(0, 0, size, size, appScreen.minSize * settings.radius)
        this.rectBg.endFill()

        const textBgWidth = appScreen.minSize * settings.textBgSizeRate
        const textBgHeight = appScreen.minSize * settings.textBgHeightRate
        const textBgOffset = (size - textBgWidth) / 2
        this.textBg.clear()
        this.textBg.beginFill(settings.textBgFill)
        this.textBg.drawRoundedRect(textBgOffset, textBgOffset, textBgWidth, textBgHeight, appScreen.minSize * settings.textBgRadius)
        this.textBg.endFill()

        const textWidth = appScreen.minSize * settings.textWidthRate
        this.text.style.fontSize = appScreen.minSize * settings.textFontSizeRate
        this.text.style.wordWrapWidth = textWidth
        this.text.position.x = (size - textWidth) / 2
        this.text.position.y = (size - textWidth) / 2
        
        const parentContainer = {minSize: appScreen.minSize, width: size, height: size}
        this.loginButton.resize( parentContainer )
        this.cancelButton.resize( parentContainer )
    }

    changeText(isLangRu) {
        this.text.text = isLangRu ? settings.textRu : settings.textEn
    }

    onClick(isLoginClicked) {
        if (this.isActive) {
            this.isActive = false
            playSound(soundKeys.click)
            if (isLoginClicked) UI.startLoginClicked()
            else UI.cancelLoginClicked()
        }
    }

    setActivation(isActive = true) {
        this.isActive = isActive
        if (isActive) {
            this.loginButton.setActivation(true)
            this.cancelButton.setActivation(true)
        }
    }
}

export default LoginPopup