class Block {
    constructor(v, x, y, map2d, sprites) {
        this.v = v;
        this.x = x;
        this.y = y;
        this.posMin = createVector(x * map2d.blockSize, y * map2d.blockSize);
        this.posMax = createVector(x * map2d.blockSize + map2d.blockSize, y * map2d.blockSize + map2d.blockSize);
        this.map2d = map2d;
        this.sprites = sprites;
        this.spriteWidth = 32;
        this.spriteHeight = 32;
        this.spriteX = 8;
        this.spriteY = 8;
    }

    

    draw2d(area) {
        area.rect(this.posMin.x, this.posMin.y, this.map2d.blockSize, this.map2d.blockSize);
        //area.image(this.sprites.wall, this.posMin.x, this.posMin.y, this.map2d.blockSize, this.map2d.blockSize, 8, 8, 32, 32);
    }


}