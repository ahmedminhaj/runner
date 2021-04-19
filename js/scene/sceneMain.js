class SceneMain extends Phaser.Scene {
    constructor() {
        super('SceneMain');
    }
    preload(){
    	
    }
    create() { 
       emitter = new Phaser.Events.EventEmitter()
       controller = new Controller()
       model.gameOver = false
       model.speed = 1
       model.score = 0
       this.alignGrid = new AlignGrid({scene:this, rows:5, cols:5})
       //this.alignGrid.showNumbers()
       
       this.road = new Road({scene:this})
       this.road.x = game.config.width*.5
       this.road.makeLines()
       
       this.scoreBox = new ScoreBox({scene:this})
       this.alignGrid.placeAtIndex(4, this.scoreBox)

       new SoundButtons({scene:this})
       emitter.on(G.SCORE_UPDATED, this.scoreUpdated, this)
    }
    scoreUpdated(){
        if(model.score/10 == Math.floor(model.score/10)){
            model.speed += .25
        }
    }
    gameOver(){
        this.scene.start('SceneOver')
    }
    
    update() {
        this.road.moveLines()
        this.road.moveObject()
        this.road.movePower()
    }

}