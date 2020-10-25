class Boundary {
    constructor(x1, y1, x2, y2) {
        this.a = createVector(x1, y1);
        this.b = createVector(x2, y2);
    }
    draw() {
        stroke(255);
        line(this.a.x, this.a.y, this.b.x, this.b.y);
    }
}

class Raycasting {
    constructor() {
        this.pos = createVector(0, 0);
    }
    update(x, y) {
        this.pos.x = x;
        this.pos.y = y;
    }
    cast(boundaries) {
        this.casts = [];

        const x3 = this.pos.x;
        const y3 = this.pos.y;

        for(let i = 0; i < 360; i+=1) {
            push();
            angleMode(DEGREES);
            translate(width/2, height/2);
            const dir = createVector(10, 0);
            dir.rotate(i);
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
        fill(255);
        circle(this.pos.x, this.pos.y, 5);
        for(let cast of this.casts)  {
            stroke(255, 50);
            line(this.pos.x, this.pos.y, cast.x, cast.y);
        }
    }
}

let raycasting;
let boundaries;
setup();

function setup() {
    createCanvas(600, 600);
    raycasting = new Raycasting();
    boundaries = [
        new Boundary(0, 0, width, 0),
        new Boundary(width, 0, width, height),
        new Boundary(width, height, 0, height),
        new Boundary(0, height, 0, 0),
    ];
    for(let i = 0; i < 6; i++) {
        boundaries.push(new Boundary(random(0, width), random(0, height), random(0, width), random(0, height)));
    }
    
}

function draw() {
    background(0);
    raycasting.update(mouseX, mouseY);
    boundaries.forEach(_ => _.draw());
    stroke(255);
    raycasting.cast(boundaries);
    raycasting.draw();
}
