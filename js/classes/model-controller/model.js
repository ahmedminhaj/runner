class Model{
    constructor(){
        this._score = 0
        this.soundOn = true
        this._musicOn = true
        this.gameOver = false
        this.shieldPower = false
        this.boostPower = false
    }
    set musicOn(val){
        this._musicOn = val
        //mediaManager.MusicChanged()
        console.log(val)
        emitter.emit(G.PLAY_MUSIC)
    }
    get musicOn(){
        return this._musicOn
    }
    set score(val){
        this._score = val
        emitter.emit(G.SCORE_UPDATED)
    }
    get score(){
        return this._score
    }
}