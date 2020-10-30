class Map2d {
    constructor(path, sprites) {
        this.blockSize = 10;
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
                    this.blocks[y][x] = new Block(v, x, y, this, sprites);
                }
            }
        }
    }

    calc() {
        this.players.forEach(_ => _.calc());
    }

    draw(area) {
        area.stroke(122);
        [...Array(this.maxX).keys()].forEach(_ => area.line(_ * this.blockSize, 0, _ * this.blockSize, this.maxY * this.blockSize));
        [...Array(this.maxY).keys()].forEach(_ => area.line(0, _ * this.blockSize, this.maxX * this.blockSize, _ * this.blockSize));
        area.stroke(255);
        area.fill(255);
        for (var x of this.blocks) {
            for (var block of x) {
                if (block) block.draw2d(area);
            }
        }
        for (const player of this.players) {
            player.draw2d(area);
        }
    }
}