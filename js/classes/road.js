class Road extends Phaser.GameObjects.Container {
    constructor(config) {
        super(config.scene)
        this.scene = config.scene
        this.back = this.scene.add.image(0, 0, "road")
        this.add(this.back)
        this.scene.add.existing(this)

        // this.back.displayWidth = game.config.width*0.5
        // this.back.scaleY = this.back.scaleX
        Align.scaleToGameW(this.back, 0.5)
        this.setSize(this.back.displayWidth, game.config.height)

        this.lineGroup = this.scene.add.group()
        this.count = 0

        this.car = this.scene.add.sprite(-this.displayWidth / 4, game.config.height * 0.9, "cars")
        Align.scaleToGameW(this.car, .11)
        this.add(this.car)

        this.back.setInteractive()
        this.back.on('pointerdown', this.changeLanes, this)
        this.addObject()
        this.addPower()

    }

    addPower() {
        this.scene.time.addEvent({ delay: 10000, callback: this.createPower, callbackScope: this, loop: true });
    }

    addObject() {
        var objs = [{ key: "police1", speed: 10, scale: 10 }, { key: "police2", speed: 10, scale: 10 }, { key: "barrier", speed: 20, scale: 8 }, { key: "cone", speed: 20, scale: 8 }]
        var index = Math.floor(Math.random() * 4)
        var key = objs[index].key
        var speed = objs[index].speed
        var scale = objs[index].scale / 100

        this.object = this.scene.add.sprite(-this.displayWidth / 4, 0, key)
        this.object.speed = speed
        var lane = Math.random() * 100
        if (lane < 50) {
            this.object.x = this.displayWidth / 4
        }
        Align.scaleToGameW(this.object, scale)
        this.add(this.object)
    }

    createPower() {
        var items = [{ key: "shield", speed: 16, scale: 5 }, { key: "boost", speed: 16, scale: 6 }]
        var index = Math.floor(Math.random() * 2)
        var key = items[index].key
        var speed = items[index].speed
        var scale = items[index].scale / 100

        this.power = this.scene.add.sprite(-this.displayWidth / 4, 0, key)
        this.power.speed = speed
        var lane = Math.random() * 100
        if (lane < 50) {
            this.power.x = this.displayWidth / 4
        }
        Align.scaleToGameW(this.power, scale)
        this.scene.tweens.add({ targets: this.power, duration: 200, angle: 35, yoyo: true, repeat: -1 })
        this.add(this.power)
    }

    changeLanes() {
        if (model.gameOver == true) {
            return
        }
        mediaManager.playSound("whoosh")
        if (this.car.x > 0) {
            this.scene.tweens.add({
                targets: this.car,
                duration: 50,
                angle: -12,
                onComplete: () => {
                    this.car.x = - this.displayWidth / 4
                    this.scene.tweens.add({ targets: this.car, duration: 50, angle: 0, })
                }
            })
        } else {
            this.scene.tweens.add({
                targets: this.car,
                duration: 50,
                angle: 12,
                onComplete: () => {
                    this.car.x = this.displayWidth / 4
                    this.scene.tweens.add({ targets: this.car, duration: 50, angle: 0, })
                }
            })
        }
    }

    makeLines() {
        this.vSpace = this.displayHeight / 10
        for (var i = 0; i < 20; i++) {
            var line = this.scene.add.image(this.x, this.vSpace * i, 'line')
            line.oy = line.y
            this.lineGroup.add(line)
        }
    }

    moveLines() {
        if (model.gameOver == true) {
            return
        }
        this.lineGroup.children.iterate(function (child) {
            child.y += this.vSpace / 20
        }.bind(this))
        this.count++
        if (this.count == 20) {
            this.count = 0
            this.lineGroup.children.iterate(function (child) {
                child.y = child.oy
            }.bind(this))
        }
    }

    goGameOver() {
        this.scene.start("SceneOver")
    }

    moveObject() {
        if (model.gameOver == true) {
            return
        }
        this.object.y += (this.vSpace / this.object.speed) * model.speed
        if (Collision.checkCollide(this.car, this.object) == true) {
            if (model.shieldPower == true) {
                emitter.emit(G.PLAY_SOUND, 'boom')
                // this.scene.tweens.add({ targets: this.object, duration: 300, angle: -270 })
                this.object.angle = -270
                this.object.speed = .002
                if(this.object.x > 0){
                    this.object.x = - this.displayWidth / 4
                }else{
                    this.object.x = this.displayWidth / 4
                }
                this.object.destroy()
            } else {
                model.gameOver = true
                //this.scene.scene.start('SceneOver')
                emitter.emit(G.PLAY_SOUND, 'boom')
                this.scene.tweens.add({ targets: this.car, duration: 1000, y: game.config.height, angle: -270 })
                this.scene.time.addEvent({ delay: 2000, callback: this.goGameOver, callbackScope: this.scene, loop: false });
            }
        }
        if (this.object.y > game.config.height) {
            if (model.boostPower == true) {
                emitter.emit(G.UP_POINTS, 2)
                this.object.destroy()
                this.addObject()
            } else {
                emitter.emit(G.UP_POINTS, 1)
                this.object.destroy()
                this.addObject()
            }
        }
    }

    movePower() {
        if (model.gameOver == true) {
            return
        }
        if (this.power == undefined) {
            return
        }
        if (Collision.checkCollide(this.car, this.power) == true) {
            if (this.power.frame.texture.key == "shield") {
                model.shieldPower = true
            }
            if (this.power.frame.texture.key == "boost") {
                model.boostPower = true
            }
            Align.scaleToGameW(this.car, 0.13)
            console.log(this.power.frame.texture.key)
            this.power.destroy()
            setTimeout(() => {
                Align.scaleToGameW(this.car, 0.11)
                model.shieldPower = false
                model.boostPower = false
            }, 5000)
        }
        this.power.y += (this.vSpace / this.power.speed)
        if (this.power.y > game.config.height) {
            this.power.destroy()
        }
    }

    printText() {
        console.log("hi")
    }
}