import { UI } from "./ui/interface"

class YandexSDK {
    constructor(YaGames) {
        this.SDK = null
        this.player = null
        this.playerTopScore = 0
        this.isPlayerAuthorized = false
        this.resultsDataName = 'SliderGame'
        this.resultsDataQuery = {
            quantityTop: 3,
            includeUser: true,
            quantityAround: 2
        }
        this.results = null
        YaGames.init().then(data => this.init(data))
    }

    init(data) {
        this.SDK = data
        this.SDK.getLeaderboards().then(results => {
            this.results = results
            if (this.isPlayerAuthorized) this.getPlayerTopScore()
        })
        this.initPlayer( () => {
            if (UI) UI.changeAuthState(this.isPlayerAuthorized) 
        })
    }

    initPlayer( callback ) {
        this.SDK.getPlayer().then(player => {
            this.player = player
            this.isPlayerAuthorized = player.getMode() !== 'lite'
            this.getPlayerTopScore()
                        
            if (callback) callback(this.isPlayerAuthorized)
        });
    }

    fetchResults( callback ) {
        if (!this.results) return callback(null)
        if (!this.isPlayerAuthorized) return callback(false)
        this.results.getLeaderboardEntries(this.resultsDataName, this.resultsDataQuery)
            .then(result => callback(result)).catch(() => callback(''))
    }

    fetchAuthorization( callback ) {
        if (this.SDK) 
        this.SDK.auth.openAuthDialog()
            .then(() => this.initPlayer(callback))
            .catch(() => callback(false))
        else callback(false)
    }

    setNewResult( score ) {
        if (!this.isPlayerAuthorized
        || !this.results
        || !Number.isInteger(score)
        || !Number.isFinite(score)
        || this.playerTopScore >= score) return

        this.results.setLeaderboardScore(this.resultsDataName, score)
        this.playerTopScore = score
    }

    getPlayerTopScore() {
        this.results.getLeaderboardPlayerEntry(this.resultsDataName).then(result => {
            this.playerTopScore = result.score
        }).catch(() => console.log('user not exist in leaderboard'))
    }

    showBannerAd( callback ) {
        if (!this.SDK) return callback()
    
        this.SDK.adv.showFullscreenAdv({
            callbacks: {
                onClose: function(wasShown) { callback() },
                onOffline: function(wasShown) { callback() },
                onError: function( error ) { callback() }
            }
        })
    }
}

const Yandex = ('YaGames' in window) ? new YandexSDK(YaGames) : null;

export default Yandex