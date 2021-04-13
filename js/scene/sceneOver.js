class SceneOver extends Phaser.Scene{
    constructor(){
        super('SceneOver')
    }
    preload(){
        this.load.image("button1", "images/ui/buttons/1/1.png")
        this.load.image("title", "images/title.png")
        this.load.image("gameOver", "images/Game-Over.png")
    }
    create(){
        this.alignGrid = new AlignGrid({rows:11, cols:11, scene:this})
        //this.alignGrid.showNumbers()
        this.backImage = this.add.image(game.config.width/2, game.config.height/2, "titleBack")

        var gameOver = this.add.image(0,0, 'gameOver')
        Align.scaleToGameW(gameOver, .5)
        this.alignGrid.placeAtIndex(27,gameOver)

        this.totalScore = this.add.text(0,0, "SCORE:"+model.score, {fontSize:24, color:'black'})
        this.totalScore.setOrigin(0.5, 0.5)
        this.alignGrid.placeAtIndex(38, this.totalScore)

        var btnStart = new FlatButton({scene:this, key:"button1", text:'Play Again', event:'start_game'})
        this.alignGrid.placeAtIndex(71, btnStart)

        emitter.on('start_game', this.startGame, this)
    }
    startGame(){
        this.scene.start('SceneMain')
    }
    update(){

    }
}