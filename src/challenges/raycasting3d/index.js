class Block {
    constructor(x, y, map2d) {
        this.x = x;
        this.y = y;
        this.posMin = createVector(x * map2d.blockSize, y * map2d.blockSize);
        this.posMax = createVector(x * map2d.blockSize + map2d.blockSize, y * map2d.blockSize + map2d.blockSize);
        this.map2d = map2d;
    }

    draw(area) {
        area.rect(this.posMin.x, this.posMin.y, this.map2d.blockSize, this.map2d.blockSize);
    }
}

class Map2d {
    constructor(path) {
        this.blockSize = 20;
        this.players = [];
        var m = path.trim().split('\n');
        this.maxX = m.reduce((p, c, a) => c.length > a ? c.length : a, 0);
        this.maxY = m.length;
        this.blocks = new Array(this.maxY);
        for (var i = 0; i < this.blocks.length; i++) {
            this.blocks[i] = new Array(this.maxX);
        }

        for (let y = 0; y < m.length; y++) {
            for (let x = 0; x < m[y].length; x++) {
                const v = m[y][x].trim();
                if (v == "1") {
                    this.players[0] = new Player(x, y, 0, this);
                } else if (v) {
                    this.blocks[y][x] = new Block(x, y, this);
                }
            }
        }
    }

    draw(area) {
        area.stroke(122);
        [...Array(this.maxX).keys()].forEach(_ => area.line(_ * this.blockSize, 0, _ * this.blockSize, this.maxY * this.blockSize));
        [...Array(this.maxY).keys()].forEach(_ => area.line(0, _ * this.blockSize, this.maxX * this.blockSize, _ * this.blockSize));
        area.stroke(255);
        area.fill(255);
        for (var x of this.blocks) {
            for (var block of x) {
                if (block) block.draw(area);
            }
        }
        for (const player of this.players) {
            player.draw(area);
        }
    }
}

class Ray {
    constructor(player, angle) {
        this.player = player;
        this.angle = angle;
    }

    calc() {
        let h;// = this.calcHorizontal();
        let v = this.calcVertical();
        if (!h) return v;
        else if (!v) return h;
        else return p5.Vector.sub(v, this.player.pos).mag() < p5.Vector.sub(h, this.player.pos).mag() ? v : h;
    }

    calcHorizontal() {
        let map2d = this.player.map2d;
        let dif = this.player.pos.copy();
        dif.x = dif.x % map2d.blockSize;
        dif.y = dif.y % map2d.blockSize;
        let angle = this.player.angle + this.angle;
        if (angle > 3 * (Math.PI / 2) || angle < Math.PI / 2) {
            for (let i = 1; i < map2d.maxX - this.player.x; i++) {
                let x = (i * map2d.blockSize - dif.x);
                let y = (Math.tan(angle) * x);
                var blockX = Math.floor((x + this.player.pos.x) / map2d.blockSize);
                var blockY = Math.floor((y + this.player.pos.y) / map2d.blockSize);
                if (blockY > 0 && blockY < map2d.maxY) {
                    let block = map2d.blocks[blockY][blockX];
                    if (block) return createVector(x, y).add(this.player.pos);
                }    
            }
        } else {
            for (let i = this.player.x; i > 0 ; i--) {
                let x = ((i - this.player.x) * map2d.blockSize - dif.x);
                let y = (Math.tan(angle) * x);
                var blockX = Math.floor((x + this.player.pos.x - map2d.blockSize) / map2d.blockSize);
                var blockY = Math.floor((y + this.player.pos.y) / map2d.blockSize);
                if (blockY >= 0 && blockY < map2d.maxY) {
                    let block = map2d.blocks[blockY][blockX];
                    if (block) return createVector(x, y).add(this.player.pos);
                }
            }
        }
    }

    calcVertical() {
        let map2d = this.player.map2d;
        let dif = this.player.pos.copy();
        dif.x = dif.x % map2d.blockSize;
        dif.y = dif.y % map2d.blockSize;
        let angle = this.player.angle + this.angle;
        if (angle > 0 && angle < Math.PI) {
            for (let i = 1; i < map2d.maxY - this.player.y; i++) {
                let y = (i * map2d.blockSize - dif.y);
                let x = (Math.tan(Math.PI/2 - angle) * y);
                var blockX = Math.floor((x + this.player.pos.x) / map2d.blockSize);
                var blockY = Math.floor((y + this.player.pos.y) / map2d.blockSize);
                if (blockY > 0 && blockY < map2d.maxY) {
                    let block = map2d.blocks[blockY][blockX];
                    if (block) return createVector(x, y).add(this.player.pos);
                }    
            }
        } else {
            for (let i = this.player.y; i > 0 ; i--) {
                let y = ((i - this.player.y) * map2d.blockSize - dif.y);
                let x = Math.tan(Math.PI/2 - angle) * y;
                var blockX = Math.floor((this.player.pos.x+x) / map2d.blockSize);
                var blockY = Math.floor(((this.player.pos.y+y) - map2d.blockSize) / map2d.blockSize);
                if (blockY >= 0 && blockY < map2d.maxY) {
                    let block = map2d.blocks[blockY][blockX];
                    if (block) return createVector(x, y).add(this.player.pos);
                }
            }
        }
    }
}

class Player {
    constructor(x, y, a, map2d) {
        this.pos = createVector((x + 0.5) * map2d.blockSize, (y + 0.5) * map2d.blockSize);
        this.angle = a
        this.map2d = map2d;
        this.velocity = this.map2d.blockSize / 20;
        let r = 1
        this.rays = [];
        for(let i = 0; i < r; i++) {
            //if (i == r-1)
            this.rays.push(new Ray(this, 0));// (((Math.PI/2)/r) * i) - Math.PI/4));
        }
        
        this.updateXY();
    }

    updateXY() {
        this.x = Math.floor(this.pos.x / this.map2d.blockSize);
        this.y = Math.floor(this.pos.y / this.map2d.blockSize);
    }

    draw(area) {
        area.stroke("green");
        let p = this.pos;
        var d = createVector(this.map2d.blockSize / 2, 0);
        d.rotate(this.angle).add(p);
        area.line(p.x, p.y, d.x, d.y);
        d.sub(p).div(2).rotate(Math.PI / 2).add(p);
        area.line(p.x, p.y, d.x, d.y);
        d.sub(p).rotate(Math.PI).add(p);
        area.line(p.x, p.y, d.x, d.y);
    }

    moveFront() {
        this.move(this.velocity, 0);
    }

    moveBack() {
        this.move(-this.velocity, 0);
    }

    moveLeft() {
        this.move(0, -this.velocity);
    }

    moveRight() {
        this.move(0, this.velocity);
    }

    move(x, y) {
        var newPos = this.pos.copy()
        newPos.rotate(-this.angle).add(createVector(x, y)).rotate(this.angle);
        const newX = Math.floor(newPos.x / this.map2d.blockSize);
        const newY = Math.floor(newPos.y / this.map2d.blockSize);
        if (!this.map2d.blocks[newY][newX]) {
            this.pos = newPos;
        }
        this.updateXY();
    }

    rotateLeft() {
        this.angle -= Math.PI / 40;
        if (this.angle < 0) this.angle += Math.PI * 2;
        this.angle = this.angle % (Math.PI * 2);
    }

    rotateRight() {
        this.angle += Math.PI / 40;
        this.angle = this.angle % (Math.PI * 2);
    }
}

const path = `
####################
#                  #
#  1            ####
#               #  #
#     #         ####
#     #            #
#     #            #
#######            #
#            #     #
#            #     #
#            #     #
#            #     #
####################
`;

let map2d;
//setup();

function setup() {
    createCanvas(800, 600);
    map2d = new Map2d(path);

}

function draw() {
    background(0);
    map2d.draw(window);
    if (keyIsDown("W".charCodeAt(0))) {
        map2d.players[0].moveFront();
    }
    if (keyIsDown("S".charCodeAt(0))) {
        map2d.players[0].moveBack();
    }
    if (keyIsDown("A".charCodeAt(0))) {
        map2d.players[0].moveLeft();
    }
    if (keyIsDown("D".charCodeAt(0))) {
        map2d.players[0].moveRight();
    }
    if (keyIsDown(LEFT_ARROW)) {
        map2d.players[0].rotateLeft();
    }
    if (keyIsDown(RIGHT_ARROW)) {
        map2d.players[0].rotateRight();
    }

    let player = map2d.players[0];
    for(let ray of player.rays) {
        let v = ray.calc();
        stroke("red");
        if (v) line(player.pos.x, player.pos.y, v.x, v.y);
    }
    textSize(20);
    fill(255);
    stroke(255);
    text(`x: ${player.x}`, 10, 300);
    text(`y: ${player.y}`, 10, 320);
    text(`px: ${player.pos.x}`, 10, 340);
    text(`py: ${player.pos.y}`, 10, 360);
    text(`a: ${player.angle}`, 10, 380);
    text(frameRate(), 10, 400);
}