class Player {
    constructor(x, y, a, map2d) {
        this.pos = createVector((x + 0.5) * map2d.blockSize, (y + 0.5) * map2d.blockSize);
        this.angle = a
        this.map2d = map2d;
        this.velocity = this.map2d.blockSize / 20;
        this.raysCount = 180;
        this.updateXY();
    }

    createRays() {
        this.rays = [];
        let c = this.raysCount;
        let r = Math.PI/3;
        if (c == 1) this.rays.push(new Ray(this, 0, 0));
        else {
            c = c % 2 ? c : c + 1;
            var t = (r);
            let s = t / (c-1);
            for(let i = 0; i < c; i++) {
                this.rays.push(new Ray(this, (s * i) - (r/2), i));
            }
        }
    }

    updateXY() {
        this.x = Math.floor(this.pos.x / this.map2d.blockSize);
        this.y = Math.floor(this.pos.y / this.map2d.blockSize);
    }

    calc() {
        this.createRays();
        this.rays.forEach(_ => _.calc());
    }

    draw2d(area) {
        area.stroke("green");
        let p = this.pos;
        var d = createVector(this.map2d.blockSize / 2, 0);
        d.rotate(this.angle).add(p);
        area.line(p.x, p.y, d.x, d.y);
        d.sub(p).div(2).rotate(Math.PI / 2).add(p);
        area.line(p.x, p.y, d.x, d.y);
        d.sub(p).rotate(Math.PI).add(p);
        area.line(p.x, p.y, d.x, d.y);

        this.rays.forEach(_ => _.draw2d());
    }

    draw3d(area) {
        for(var ray of this.rays) {
            ray.draw3d(area);
        }
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
        this.angle -= Math.PI / 80;
        if (this.angle < 0) this.angle += Math.PI * 2;
        this.angle = this.angle % (Math.PI * 2);
    }

    rotateRight() {
        this.angle += Math.PI / 80;
        this.angle = this.angle % (Math.PI * 2);
    }
}