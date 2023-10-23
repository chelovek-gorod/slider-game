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

    closeSize: 260,
    closeSizeRate: 0.1,

    textTitleSizeRate: 0.1,
    textTitleRu: 'Поделиться',
    textTitleEn: 'Share',

    iconBgSizeRate: 0.7,
    iconBgOffsetXRate: 0.15,
    iconBgOffsetYRate: 0.2,
    iconBgFill: 0xffffff,

    iconSize: 150,
}

class SocialPopup extends Container {
    constructor(isLangRu) {
        super()

        this.data = null

        this.isLangRu = isLangRu

        this.rectBg = new Graphics()
        this.addChild(this.rectBg)

        this.iconsBg = new Graphics()
        this.addChild(this.iconsBg)

        this.title = new Text( isLangRu ? settings.textTitleRu : settings.textTitleEn, textStyles.message )
        this.title.anchor.set(0.5, 0)
        this.addChild(this.title)

        this.isActive = false
        this.close = new Sprite( getTexture(textureKeys.close) )
        this.close.eventMode = 'static';
        this.close.on('pointertap', this.onClick.bind(this))
        this.close.anchor.set(1, 0)
        this.addChild(this.close)

        this.copyLink = new Sprite( getTexture(textureKeys.social_cl) )
        this.copyLink.eventMode = 'static';
        this.copyLink.on('pointertap', this.onClick.bind(this, 'copyLink'))
        this.copyLink.anchor.set(0.5)
        this.addChild(this.copyLink)

        this.whatsApp = new Sprite( getTexture(textureKeys.social_ws) )
        this.whatsApp.eventMode = 'static';
        this.whatsApp.on('pointertap', this.onClick.bind(this, 'whatsApp'))
        this.whatsApp.anchor.set(0.5)
        this.addChild(this.whatsApp)

        this.telegram = new Sprite( getTexture(textureKeys.social_tg) )
        this.telegram.eventMode = 'static';
        this.telegram.on('pointertap', this.onClick.bind(this, 'telegram'))
        this.telegram.anchor.set(0.5)
        this.addChild(this.telegram)

        this.viber = new Sprite( getTexture(textureKeys.social_vb) )
        this.viber.eventMode = 'static';
        this.viber.on('pointertap', this.onClick.bind(this, 'viber'))
        this.viber.anchor.set(0.5)
        this.addChild(this.viber)

        this.facebook = new Sprite( getTexture(textureKeys.social_fb) )
        this.facebook.eventMode = 'static';
        this.facebook.on('pointertap', this.onClick.bind(this, 'facebook'))
        this.facebook.anchor.set(0.5)
        this.addChild(this.facebook)

        this.vk = new Sprite( getTexture(textureKeys.social_vk) )
        this.vk.eventMode = 'static';
        this.vk.on('pointertap', this.onClick.bind(this, 'vk'))
        this.vk.anchor.set(0.5)
        this.addChild(this.vk)

        this.instagram = new Sprite( getTexture(textureKeys.social_ig) )
        this.instagram.eventMode = 'static';
        this.instagram.on('pointertap', this.onClick.bind(this, 'instagram'))
        this.instagram.anchor.set(0.5)
        this.addChild(this.instagram)

        this.twitter = new Sprite( getTexture(textureKeys.social_tt) )
        this.twitter.eventMode = 'static';
        this.twitter.on('pointertap', this.onClick.bind(this, 'twitter'))
        this.twitter.anchor.set(0.5)
        this.addChild(this.twitter)

        this.ok = new Sprite( getTexture(textureKeys.social_ok) )
        this.ok.eventMode = 'static';
        this.ok.on('pointertap', this.onClick.bind(this, 'ok'))
        this.ok.anchor.set(0.5)
        this.addChild(this.ok)
    }

    resize(appScreen) { console.log('resize', appScreen)
        const size = appScreen.minSize * settings.sizeRate
        this.position.x = (appScreen.width - size) / 2
        this.position.y = (appScreen.height - size) / 2

        this.rectBg.clear()
        this.rectBg.lineStyle(size * settings.borderSizeRate, settings.borderFill, 1)
        this.rectBg.beginFill(settings.fill, settings.alpha)
        this.rectBg.drawRoundedRect(0, 0, size, size, appScreen.minSize * settings.radius)
        this.rectBg.endFill()

        this.title.style.fontSize = size * settings.textTitleSizeRate
        this.title.position.x = size * 0.5
        this.title.position.y = size * 0.05

        let buttonHeight = size * settings.closeSizeRate
        if (buttonHeight > settings.closeSize) buttonHeight = settings.closeSize
        this.close.width = this.close.height = buttonHeight
        this.close.position.x = size - size * 0.05
        this.close.position.y = size * 0.05       

        const bgSize = size * settings.iconBgSizeRate
        const bgX = size * settings.iconBgOffsetXRate
        const bgY = size * settings.iconBgOffsetYRate

        this.iconsBg.clear()
        this.iconsBg.beginFill(settings.iconBgFill, 1)
        this.iconsBg.drawRoundedRect(bgX, bgY, bgSize, bgSize, appScreen.minSize * settings.radius)
        this.iconsBg.endFill()

        let iconSize = bgSize * 0.2
        if (iconSize > settings.iconSize) iconSize = settings.iconSize
        let stepSize = bgSize * 0.1

        this.blitIcon(this.whatsApp, iconSize, bgX + stepSize * 2, bgY + stepSize * 2)
        this.blitIcon(this.telegram, iconSize, bgX + stepSize * 5, bgY + stepSize * 2)
        this.blitIcon(this.viber, iconSize, bgX + stepSize * 8, bgY + stepSize * 2)

        this.blitIcon(this.facebook, iconSize, bgX + stepSize * 2, bgY + stepSize * 5)
        this.blitIcon(this.copyLink, iconSize, bgX + stepSize * 5, bgY + stepSize * 5)      
        this.blitIcon(this.vk, iconSize, bgX + stepSize * 8, bgY + stepSize * 5)

        this.blitIcon(this.instagram, iconSize, bgX + stepSize * 2, bgY + stepSize * 8)
        this.blitIcon(this.twitter, iconSize, bgX + stepSize * 5, bgY + stepSize * 8)
        this.blitIcon(this.ok, iconSize, bgX + stepSize * 8, bgY + stepSize * 8)
    }

    blitIcon(icon, size, x, y) {
        icon.width = icon.height = size
        icon.position.x = x
        icon.position.y = y
    }

    changeText(isLangRu) {
        this.isLangRu = isLangRu
        this.title.text = isLangRu ? settings.textTitleRu : settings.textTitleEn, textStyles.message
    }

    setActivation(isActive = true) {
        this.isActive = isActive
    }

    onClick( action = null ) {
        if (this.isActive) {
            this.isActive = false
            playSound(soundKeys.click)

            const href = window.location.href
            const text = 'Slider%20-%20memory%20training%20game%20'

            switch(action) {

                case 'copyLink' : navigator.clipboard.writeText(href); break;
                case 'whatsApp' : window.open('https://api.whatsapp.com/send?text=' + text + href, '_blank'); break;
                case 'telegram' : window.open('https://t.me/share/url?url=' + href + ';text=' + text + '&amp;', '_blank'); break;
                case 'viber' : window.open('viber://forward?text=' + text + href, '_blank'); break;
                case 'facebook' : window.open('https://www.facebook.com/sharer/sharer.php?u=' + href + '&t=' + text, '_blank'); break;
                case 'vk' : window.open('https://vk.com/share.php?url=' + href + ';title=' + text + '&amp;', '_blank'); break;
                case 'instagram' : window.open('https://www.instagram.com/?url=' + href, '_blank'); break;
                case 'twitter' : window.open('https://twitter.com/intent/tweet?text=' + text + '&amp;url=' + href + '&amp;', '_blank'); break;
                case 'ok' : window.open('https://connect.ok.ru/offer?url=' + href + '&amp;title=' + text + '&amp;', '_blank'); break;
            }

            UI.hideSocialPopup()
        }
    }
}

export default SocialPopup