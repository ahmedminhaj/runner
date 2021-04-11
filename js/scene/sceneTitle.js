class SceneTitle extends Phaser.Scene{
    constructor(){
        super('SceneTitle')
    }
    preload(){
        this.load.image("button1", "images/ui/buttons/1/1.png")
        this.load.image("title", "images/title.png")
    }
    create(){
        emitter = new Phaser.Events.EventEmitter()
        controller = new Controller()

        this.alignGrid = new AlignGrid({rows:11, cols:11, scene:this})
        // this.alignGrid.showNumbers()
        
        var title = this.add.image(0,0, 'title')
        Align.scaleToGameW(title, .5)
        this.alignGrid.placeAtIndex(38,title)

        var btnStart = new FlatButton({scene:this, key:"button1", text:'Start', event:'start_game'})
        this.alignGrid.placeAtIndex(60, btnStart)

        emitter.on('start_game', this.startGame, this)
    }
    startGame(){
        this.scene.start('SceneMain')
    }
    update(){

    }
}