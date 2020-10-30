class Block {
    constructor(v, x, y, map2d, sprites) {
        this.v = v;
        this.x = x;
        this.y = y;
        this.posMin = createVector(x * map2d.blockSize, y * map2d.blockSize);
        this.posMax = createVector(x * map2d.blockSize + map2d.blockSize, y * map2d.blockSize + map2d.blockSize);
        this.map2d = map2d;
        this.sprites = sprites;
        this.mapSprite();
        
    }

    mapSprite() {
        let w = 32;
        let h = 32;
        let x;
        let y;
        switch (this.v) {
            case "A": x = 0; y = 0; break;
            case "B": x = 1; y = 0; break;
            case "C": x = 2; y = 0; break;
            case "D": x = 3; y = 0; break;
            case "E": x = 0; y = 1; break;
            case "F": x = 1; y = 1; break;
            case "G": x = 2; y = 1; break;
            case "H": x = 3; y = 1; break;
            case "I": x = 0; y = 2; break;
            case "J": x = 1; y = 2; break;
            case "K": x = 2; y = 2; break;
            case "L": x = 3; y = 2; break;
            case "M": x = 0; y = 4; break;
            case "N": x = 1; y = 4; break;
            case "O": x = 2; y = 4; break;
            case "P": x = 3; y = 4; break;
            case "Q": x = 0; y = 5; break;
            case "R": x = 1; y = 5; break;
            case "S": x = 2; y = 5; break;
            case "T": x = 3; y = 5; break;
            default:
        }

        this.spriteWidth = w;
        this.spriteHeight = h;
        this.spriteX = 8 + 80 * x;
        this.spriteY = 8 + 40 * y;
        this.spriteVerticalX = 48 + 80 * x;
        this.spriteVerticalY = 8 + 40 * y;
    }

    getSpritePosition(vertical) {
        return {
            w: this.spriteWidth,
            h: this.spriteHeight,
            x: vertical ? this.spriteVerticalX : this.spriteX,
            y: vertical ? this.spriteVerticalY : this.spriteY
        }
    }

    

    draw2d(area) {
        area.rect(this.posMin.x, this.posMin.y, this.map2d.blockSize, this.map2d.blockSize);
        //area.image(this.sprites.wall, this.posMin.x, this.posMin.y, this.map2d.blockSize, this.map2d.blockSize, 8, 8, 32, 32);
    }


}