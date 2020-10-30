class Ray {
    constructor(player, angle, n) {
        this.player = player;
        this.angle = angle;
        this.n = n;
        this.pos = createVector();
        this.vertical = false;
    }

    calc() {
        let map2d = this.player.map2d;
        let dif = this.player.pos.copy();
        dif.x = dif.x % map2d.blockSize;
        dif.y = dif.y % map2d.blockSize;
        let angle = (this.player.angle + this.angle) % (Math.PI * 2);
        let h = this.calcHorizontal(dif, angle, map2d);
        let v = this.calcVertical(dif, angle, map2d);
        let r;
        if (!h) {
            r = v;
        } else if (!v) {
            r = h;
        } else if (p5.Vector.sub(v.pos, this.player.pos).mag() < p5.Vector.sub(h.pos, this.player.pos).mag()) {
            r = v;
        } else {
            r = h;
        }
        this.pos = r.pos;
        this.block = r.block;
        this.vertical = r.vertical;
        this.invert = r.invert;
    }

    calcVertical(dif, angle) {
        if (angle > 3 * (Math.PI / 2) || angle < Math.PI / 2) {
            for (let i = 1; i < this.player.map2d.maxX - this.player.x; i++) {
                let x = (i * map2d.blockSize - dif.x);
                let y = (Math.tan(angle) * x);
                let rayPosition = this.calcRayPosition(x, y, false, false);
                if (rayPosition) return {...rayPosition, vertical: true };
            }
        } else {
            for (let i = this.player.x; i > 0; i--) {
                let x = ((i - this.player.x) * this.player.map2d.blockSize - dif.x);
                let y = (Math.tan(angle) * x);
                let rayPosition = this.calcRayPosition(x, y, true, false);
                if (rayPosition) return {...rayPosition, vertical: true };
            }
        }
    }


    calcHorizontal(dif, angle) {
        if (angle > 0 && angle < Math.PI) {
            for (let i = 1; i < this.player.map2d.maxY - this.player.y; i++) {
                let y = (i * map2d.blockSize - dif.y);
                let x = (Math.tan(Math.PI / 2 - angle) * y);
                let rayPosition = this.calcRayPosition(x, y, false, false);
                if (rayPosition) return {...rayPosition, vertical: false };
            }
        } else {
            for (let i = this.player.y; i > 0; i--) {
                let y = ((i - this.player.y) * this.player.map2d.blockSize - dif.y);
                let x = Math.tan(Math.PI / 2 - angle) * y;
                let rayPosition = this.calcRayPosition(x, y, false, true);
                if (rayPosition) return {...rayPosition, vertical: false };
            }
        }
    }

    calcRayPosition(posX, posY, invertX, invertY) {
        let map2d = this.player.map2d;
        var x = Math.floor((this.player.pos.x + posX - (invertX ? map2d.blockSize : 0)) / map2d.blockSize);
        var y = Math.floor((this.player.pos.y + posY - (invertY ? map2d.blockSize : 0)) / map2d.blockSize);
        if (y >= 0 && y < map2d.maxY) {
            let block = this.player.map2d.blocks[y][x];
            if (block) return { block: block, pos: createVector(posX, posY).add(this.player.pos), invert: invertX || invertY };
        }
    }

    draw2d() {
        if (this.pos) {
            stroke("red");
            line(this.player.pos.x, this.player.pos.y, this.pos.x, this.pos.y);
        }
    }

    draw3d(area) {
        let w = area.width / this.player.raysCount;
        let h = ((area.height * 10) / (p5.Vector.sub(this.player.pos, this.pos).mag() + 1));
        let x = (this.n * w);
        let y = area.height / 2 - h / 2;
        let sw;
        if (!this.vertical) {
            sw = this.pos.x - this.block.posMin.x;
        } else {
            sw = this.pos.y - this.block.posMin.y;
        }
        let a = map(h, (area.height * 0.5), area.height/20, 0, 255);
        //area.push();
        //area.colorMode(area.HSB, 255); 
      
    // Initialize the parameter 
        // let c = area.color(255, 255, 255, a); 
        // area.brightness(c);
        area.noSmooth();
        let spritePostion = this.block.getSpritePosition(this.vertical);
        area.image(this.block.sprites.wall, x, y, w, h, spritePostion.x + Math.floor(sw * (32/this.player.map2d.blockSize)), spritePostion.y, 1, spritePostion.h);
        //area.pop();
        
        
        
        // area.noStroke();
        // area.fill(0, 0, 0, a);
        // area.rect((this.n*w), area.height/2 - h/2, w, h);
    }
}