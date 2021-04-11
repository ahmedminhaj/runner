class SceneMain extends Phaser.Scene {
    constructor() {
        super('SceneMain');
    }
    preload(){
    	this.load.image("road", "images/road.jpg");
    	this.load.image("car", "images/myCar.png");
    	this.load.spritesheet("cars", "images/cars.png", {frameWidth: 60, frameHeight:126});
    	this.load.image("police1", "images/pcar1.png");
    	this.load.image("police2", "images/pcar2.png");
    	this.load.image("barrier", "images/barrier.png");
        this.load.image("line", "images/line.png")
        this.load.image("button1", "images/ui/buttons/1/1.png")
        
        this.load.audio('boom', ["audio/boom.mp3", "audio/boom.ogg"])
        this.load.audio('whoosh', ["audio/whoosh.mp3", "audio/whoosh.ogg"])
        this.load.audio('backgroundMusic', ["audio/random-race.mp3", "audio/random-race.ogg"])

        this.load.image("toggleBack", "images/ui/toggles/1.png")
        this.load.image("sfxOff", "images/ui/icons/sfx_off.png")
        this.load.image("sfxOn", "images/ui/icons/sfx_on.png")
        this.load.image("musicOn", "images/ui/icons/music_on.png")
        this.load.image("musicOff", "images/ui/icons/music_off.png")
    }
    create() { 
       //define our objects
       emitter = new Phaser.Events.EventEmitter()
       controller = new Controller()
       var mediaManager = new MediaManager({scene:this})
       model.gameOver = false
       
       this.road = new Road({scene:this})
       this.road.x = game.config.width/2
       this.road.makeLines()
       
       this.sb = new ScoreBox({scene:this})
       this.sb.x = game.config.width - 50
       this.sb.y = 50

       this.alignGrid = new AlignGrid({scene:this, rows:5, cols:5})
    //    this.alignGrid.showNumbers()
       this.alignGrid.placeAtIndex(4, this.sb)

       var soundButtons = new SoundButtons({scene:this})
    }

    gameOver(){
        this.scene.start('SceneOver')
    }
    
    update() {
        //constant running loop
        this.road.moveLines()
        this.road.moveObject()
    }

}