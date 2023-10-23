import { Container } from 'pixi.js'
import { initGame } from "./game";
import appAssets, { fontKeys } from './assets'
import { Assets } from 'pixi.js'
import { screenAddContainer, clearContainer} from './appScreen';
import ProgressBar from './ui/progressBar'
import { loadAssets } from './loader'

const fonts = {}
for (let font in appAssets.fonts) fonts[font] = appAssets.fonts[fontKeys[font]]
Assets.addBundle('fonts', fonts);
Assets.loadBundle('fonts').then(uploadAssets)

function uploadAssets() {
    const LoadContainer = new Container()
    screenAddContainer(LoadContainer)

    const loadingProgressBar = new ProgressBar( "0%" )
    LoadContainer.addChild( loadingProgressBar )

    loadAssets( (loadedAssetsCount, totalAssetsCount, loadingProgress) => {
        loadingProgressBar.upload(loadingProgress, `${loadingProgress}%`)
        if (loadedAssetsCount === totalAssetsCount) {
            clearContainer( LoadContainer )
            LoadContainer.destroy( {children : true} )
            initGame()
        }
    })
}