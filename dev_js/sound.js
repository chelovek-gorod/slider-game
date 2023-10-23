import { musics, sounds } from "./loader"
const { Howl } = require('howler')

let isMusic = true

let musicKeys = Array.from( musics.keys() );
let musicIndex = 0
let music = null

export function musicOn() {
    isMusic = true
    playMusic()
}

export function musicOff() {
    isMusic = false
    if (music) stopMusic()
}

export function musicCheck() {
    return isMusic
}

export function playSound(sound) {
    if (!isMusic) return
    if (sounds.has(sound)) sounds.get(sound).play()
}

function nextTrack() {
    music = null
    musicIndex++
    if (musicIndex === musicKeys.length) musicIndex = 0

    startMusic()
}

export function playMusic() {
    if (!isMusic || !music || music.playing()) return

    music.play()
}

export function stopMusic() {
    if (music) music.pause()
}

export function startMusic() {
    if (music) return
    
    const track = musics.get(musicKeys[musicIndex])
    music = new Howl({
        src: [track],
        volume: 0.7,
        onend: nextTrack,
    });

    playMusic()
}