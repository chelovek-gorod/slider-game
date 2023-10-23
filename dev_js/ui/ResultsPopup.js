import { Container, Graphics, Sprite, Text } from "pixi.js";
import { textureKeys, soundKeys } from "../assets";
import { getTexture } from "../loader";
import { textStyles } from './textStyles'
import { playSound } from "../sound";
import { UI } from "./interface";
import { clearContainer } from "../appScreen";

const settings = {
    sizeRate: 0.8,
    fill: 0xffffff,
    alpha: 0.7,
    radius: 0.05,
    offset: 0.05,
    borderSizeRate: 0.01,
    borderFill: "#505f68",

    cupWidth: 272,
    cupHeight: 260,
    cupWidthRate: 272 / 260,
    cupHeightRate: 0.12,

    closeSize: 260,
    closeSizeRate: 0.1,

    textTitleSizeRate: 0.1,
    textTitleRu: 'Результаты',
    textTitleEn: 'Results',

    dataBgOffsetX: 0.025,
    dataBgOffsetY: 0.185,
    dataBgWidthRate: 0.95,
    dataBgHeightRate: 0.79,
    dataBgFill: 0xffffff,

    containerRateOffsetX: 0.05,
    containerRateOffsetY: 0.2,
    containerWidthRate: 0.9,

    textNameMaxChars: 14,
    textSizeRate: 0.04,
    textPlaceWidthRate: 0.125,
    textNameWidthRate: 0.525,
    textScoreWidthRate: 0.875,
    textCaptionFill: 0x808080,
    //{ formattedScore: "197", score: 197, rank:  1, player: {publicName: ''} }
    captionDataRu: {
        rank: 'Место',
        player: {publicName: 'Игрок'},
        formattedScore: 'Очки',
    },
    captionDataEn: {
        rank: 'Place',
        player: {publicName: 'Player'},
        formattedScore: 'Score',
    },
    emptyNameRu: 'Неизвестный игрок',
    emptyNameEn: 'Unknown player',

    verticalOffsetRate: 0.015,

    textBgHeightRate: 0.06,
    textBgFill: 0xeeeeee,
    textBgPlayerFill: 0xffe080,
}

class ResultsPopup extends Container {
    constructor(isLangRu) {
        super()

        this.data = null

        this.isLangRu = isLangRu

        this.rectBg = new Graphics()
        this.addChild(this.rectBg)

        this.dataBg = new Graphics()
        this.addChild(this.dataBg)

        this.cup = new Sprite( getTexture(textureKeys.cup) )
        this.cup.anchor.set(0, 0)
        this.addChild(this.cup)

        this.title = new Text( isLangRu ? settings.textTitleRu : settings.textTitleEn, textStyles.message )
        this.title.anchor.set(0.5, 0)
        this.addChild(this.title)

        this.isActive = false
        this.close = new Sprite( getTexture(textureKeys.close) )
        this.close.eventMode = 'static';
        this.close.on('pointertap', this.onClick.bind(this))
        this.close.anchor.set(1, 0)
        this.addChild(this.close)

        this.container = new Container()
        this.addChild(this.container)

        this.options = {}
    }

    drawDataLine(lineData, offsetRate, bgFill = null, isManyDots = false) {
        console.log('bgFill', bgFill, 'isManyDots', isManyDots)
        const offset = offsetRate * this.options.offset
        if (bgFill) {
            const bg = new Graphics()
            bg.beginFill(bgFill)
            bg.drawRoundedRect(0, offset, this.options.width, this.options.height, this.options.radius)
            bg.endFill()
            this.container.addChild(bg)
        }

        const testStyle = {...textStyles.results, fontSize: this.options.fontSize}
        const positionY = this.options.halfHeight + offset
        if (isManyDots) {
            const dots = new Text('...', testStyle)
            dots.anchor.set(0.5)
            dots.position.x = this.options.nameCenterX
            dots.position.y = positionY
            this.container.addChild(dots)
        } else {
            //{ formattedScore: "197", score: 197, rank:  1, player: {publicName: ''} }
            const placeText = new Text(lineData.rank + '', testStyle)
            placeText.anchor.set(0.5)
            placeText.position.x = this.options.placeCenterX
            placeText.position.y = positionY
            this.container.addChild(placeText)

            let name = lineData.player.publicName
            if (name.length > settings.textNameMaxChars) name = name.slice(0, settings.textNameMaxChars - 2) + '...'
            if (name.length === 0) name = this.isLangRu ? settings.emptyNameRu : settings.emptyNameEn
            const nameText = new Text(name, testStyle)
            nameText.anchor.set(0.5)
            nameText.position.x = this.options.nameCenterX
            nameText.position.y = positionY
            this.container.addChild(nameText)

            const scoreText = new Text(lineData.formattedScore, testStyle)
            scoreText.anchor.set(0.5)
            scoreText.position.x = this.options.scoreCenterX
            scoreText.position.y = positionY
            this.container.addChild(scoreText)

            if (!bgFill && !isManyDots) {
                // CAPTION console
                placeText.style.fill = settings.textCaptionFill
                nameText.style.fill = settings.textCaptionFill
                scoreText.style.fill = settings.textCaptionFill
            }
        }
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

        this.dataBg.clear()
        this.dataBg.beginFill(settings.dataBgFill, 1)
        this.dataBg.drawRoundedRect(settings.dataBgOffsetX * size, settings.dataBgOffsetY * size,
            settings.dataBgWidthRate * size, settings.dataBgHeightRate * size,
            appScreen.minSize * settings.radius * 0.5)
        this.dataBg.endFill()

        let imageHeight = size * settings.cupHeightRate
        if (imageHeight > settings.cupHeight) imageHeight = settings.cupHeight
        this.cup.height = imageHeight
        this.cup.width = imageHeight * settings.cupWidthRate
        this.cup.position.x = size * settings.offset
        this.cup.position.y = size * (settings.offset - 0.01)

        this.title.style.fontSize = size * settings.textTitleSizeRate
        this.title.position.x = size * 0.5
        this.title.position.y = size * 0.04

        let buttonHeight = size * settings.closeSizeRate
        if (buttonHeight > settings.closeSize) buttonHeight = settings.closeSize
        this.close.width = this.close.height = buttonHeight
        this.close.position.x = size - size * 0.05
        this.close.position.y = size * 0.05

        this.container.position.x = size * settings.containerRateOffsetX
        this.container.position.y = size * settings.containerRateOffsetY

        clearContainer(this.container)
        this.options = {}
        this.options.width = size * settings.containerWidthRate
        this.options.height = size * settings.textBgHeightRate
        this.options.halfHeight = this.options.height / 2
        this.options.radius = this.options.height / 2
        this.options.offset = this.options.height + size * settings.verticalOffsetRate
        this.options.fontSize = size * settings.textSizeRate
        this.options.placeCenterX = this.options.width * settings.textPlaceWidthRate
        this.options.nameCenterX = this.options.width * settings.textNameWidthRate
        this.options.scoreCenterX = this.options.width * settings.textScoreWidthRate
        
        this.drawDataLine(this.isLangRu ? settings.captionDataRu : settings.captionDataEn, 0)

        if (this.data) this.fillResults( this.data )
    }

    fillResults(data) {
        this.data = data
        const rank = data.userRank
        let size = data.entries.length
        let isDotsAdded = false
        for(let i = 0; i < size; i++) {
            let index = isDotsAdded ? i - 1 : i
            let line = data.entries[index]
            if (!isDotsAdded && line.rank != index + 1) { console.log('...')
                size++
                isDotsAdded = true
                this.drawDataLine({}, index + 1, null, true)
            } else {
                this.drawDataLine(line, index + 1 + +isDotsAdded, rank === line.rank ? settings.textBgPlayerFill : settings.textBgFill)
            }
        }
    }

    changeText(isLangRu) {
        this.isLangRu = isLangRu
        this.title.text = isLangRu ? settings.textTitleRu : settings.textTitleEn, textStyles.message
    }

    setActivation(isActive = true) {
        this.isActive = isActive
    }

    onClick() {
        if (this.isActive) {
            this.isActive = false
            this.data = null
            playSound(soundKeys.click)
            UI.hideResultsPopup()
        }
    }
}

export default ResultsPopup