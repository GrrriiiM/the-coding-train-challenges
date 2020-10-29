class Boundary {
    constructor(x1, y1, x2, y2) {
        this.a = createVector(x1, y1);
        this.b = createVector(x2, y2);
    }
    draw(area) {
        area.stroke(255);
        area.line(this.a.x, this.a.y, this.b.x, this.b.y);
    }
}

class Block {
    constructor(x, y, blockSize) {
        this.pos = createVector(x, y);
        this.boundaries = [];
        let ps = [[0, 0], [0, 1], [1, 1], [1, 0]];
        for (let i = 0; i < ps.length; i++) {
            let j = (i + 1) % ps.length;
            let v1 = p5.Vector.add(this.pos, createVector(ps[i][0], ps[i][1])).mult(blockSize);
            let v2 = p5.Vector.add(this.pos, createVector(ps[j][0], ps[j][1])).mult(blockSize);
            this.boundaries.push(new Boundary(v1.x, v1.y, v2.x, v2.y));
        }
    }
}

class Wall {
    constructor(blocksPosition, blockSize) {
        this.blocks = [];
        for (let x = 0; x < blocksPosition.length; x++) {
            for (let y = 0; y < blocksPosition[x].length; y++) {
                if (blocksPosition[x][y]) {
                    this.blocks.push(new Block(y, x, blockSize));
                }
            }
        }

    }
}

class Raycasting {
    constructor(area) {
        this.pos = createVector(area.width/2, area.height/2);
        this.area = area;
        this.angle = 0;
        this.eyeAngle = 20
    }
    update(x, y) {
        this.pos.x = x;
        this.pos.y = y;
    }
    cast(boundaries) {
        this.casts = [];

        const x3 = this.pos.x;
        const y3 = this.pos.y;

        for (let i = 0; i < this.eyeAngle; i += 0.25) {
            push();
            angleMode(DEGREES);
            translate(width / 2, height / 2);
            const dir = createVector(10, 0);
            dir.rotate(i + this.angle - (this.eyeAngle/2));
            dir.normalize();
            dir.add(this.pos);
            const x4 = dir.x;
            const y4 = dir.y;
            pop();

            let min;
            for (let b of boundaries) {
                const x1 = b.a.x;
                const y1 = b.a.y;
                const x2 = b.b.x;
                const y2 = b.b.y;
                const den = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
                if (den == 0) continue;
                const t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / den;
                const u = -((x1 - x2) * (y1 - y3) - (y1 - y2) * (x1 - x3)) / den;
                if (t > 0 && t < 1 && u > 0) {
                    let c = createVector(x1 + t * (x2 - x1), y1 + t * (y2 - y1));
                    min = min || c;
                    let dist = p5.Vector.sub(c, this.pos);
                    let distMin = p5.Vector.sub(min, this.pos);
                    if ((dist.mag() < distMin.mag()) || (dist.mag() == distMin.mag() && Math.abs(c.x) < Math.abs(min.x)))
                        min = c;

                }
            }
            //console.log(min);

            if (min) this.casts.push(min);
        }
    }

    draw() {
        this.area.fill(255);
        this.area.circle(this.pos.x, this.pos.y, 5);
        for (let cast of this.casts) {
            this.area.stroke(255, 50);
            this.area.line(this.pos.x, this.pos.y, cast.x, cast.y);
        }
    }
}

class Map {
    constructor(walls, width, height) {
        this.area = createGraphics(width, height);
        this.mask = createGraphics(width, height);
        this.mask.fill('rgba(0, 0, 0, 1)');
        this.mask.circle(width/2, height/2, 128);
        
        this.camera = new Raycasting(this.area);
        this.walls = walls;
        this.boundaries = [
            new Boundary(1, 1, width - 1, 1),
            new Boundary(width - 1, 1, width - 1, height - 1),
            new Boundary(width - 1, height - 1, 1, height - 1),
            new Boundary(1, height - 1, 1, 1),
        ];
        this.boundaries = this.boundaries.concat(this.walls.map(w => w.blocks.map(b => b.boundaries).flat()).flat());
    }
    draw() {
        let offsetX = -this.camera.pos.x+(this.area.width/2);
        let offsetY = -this.camera.pos.y+(this.area.height/2);
        this.area.translate(offsetX, offsetY);
        this.area.background(124);
        this.camera.draw(this.area);
        this.boundaries.forEach(_ => _.draw(this.area));
        this.area.translate(-offsetX, -offsetY);
    

        let area = this.area.get()
        area.resize(this.area.width/2, this.area.height/2);
        //area.mask(this.mask);
        //image(area, -(this.area.width/2)+74, -(this.area.height/2)+74);
        image(area, 10, 10);
    }
}

let map;
let blockSize = 50;
let velocity = 3;
//setup();



function setup() {
    createCanvas(600, 600);
    

    var wall = new Wall([
        [0],
        [0, 1],
        [0, 1],
        [0, 0,0,0,0,0,0,0,1], 
        [0, 0,0,0,0,0,0,0,0,1], 
        [0, 0,0,0,0,0,0,0,0,1], 
        [0, 0,0,0,0,0,0,0,1],
        [0, 0,0,0,0,0,0,0,1],
        
        [0, 0]
    ], blockSize);
    map = new Map([wall], width, height);
}

function draw() {
    background(0);
    if (keyIsDown(LEFT_ARROW)) map.camera.angle -= velocity;
    if (keyIsDown(RIGHT_ARROW)) map.camera.angle += velocity;
    var pos = createVector();
    if (keyIsDown("W".charCodeAt(0))) pos.x += velocity;
    if (keyIsDown("S".charCodeAt(0))) pos.x -= velocity;
    if (keyIsDown("A".charCodeAt(0))) pos.y -= velocity;
    if (keyIsDown("D".charCodeAt(0))) pos.y += velocity;
    pos.rotate(map.camera.angle);
    map.camera.pos.add(pos);
    map.camera.cast(map.boundaries);
    

    
    noStroke();
    fill(194, 126, 25);
    rect(0, height/2, width, height/2);

    var w = width/map.camera.casts.length;
    for(let i = 0; i < map.camera.casts.length; i++) {
        const cast = map.camera.casts[i];
        const dist = p5.Vector.sub(cast,map.camera.pos).mag();
        fill(255-(255*(dist/1000)));
        const h = window.map(dist, 0, 600, height, 1, true);
        rect((i+0.5)*w, height/2-h/2, w, h);
    }

    map.draw();

    frameRate();
}
