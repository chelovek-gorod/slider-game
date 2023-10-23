import { Assets } from 'pixi.js'
import appAssets from './assets'
const { Howl } = require('howler')

const textures = new Map( Object.entries( appAssets.textures ).map( ([key, value]) => [key, value] ) )
/* uploading fonts in main js, before game init */
export const sounds = new Map( Object.entries( appAssets.sounds ).map( ([key, value]) => [key, value] ) )
export const musics = new Map( Object.entries( appAssets.musics ).map( ([key, value]) => [key, value] ) )

export function loadAssets ( onProgress ) {
    const totalAssetsCount = textures.size + sounds.size // + musics.size
    let loadedAssetsCount = 0
    let progressPerAsset = 100 / totalAssetsCount
    onProgress( loadedAssetsCount, totalAssetsCount, 0 )
    const updateLoadingProgress = () => {
        loadedAssetsCount += 1;
        const loadingProgress = +(loadedAssetsCount * progressPerAsset).toFixed()
        onProgress( loadedAssetsCount, totalAssetsCount, loadingProgress )
    }

    textures.forEach( (value, key) => Assets.add( key, value ) )
    Assets.load( [ ...textures.keys() ] ).then( (data) => {
        Object.entries( data ).forEach( ([key, value]) => {
            textures.set(key, value)
            updateLoadingProgress()
        })
    })

    sounds.forEach( (value, key) => {
        const sound = new Howl( {src: [value]} );
        sound.on('load', updateLoadingProgress)
        sounds.set(key, sound)
    })
}

export function getTexture( textureKey ) {
    if ( textures.has( textureKey ) ) return textures.get( textureKey )
    return null
}