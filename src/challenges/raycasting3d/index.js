const path = `
###############################################################
#          #                #            #                    #
#1                          #                                 #
#          #     #####      #            #      #######       #
############     #####      #            #      #             #
#          #     #####      ##############      #             #
#          #                                    #             #
#          #                ##############                    #
#          ##################            ######### ############
#                                                             #
#                                                             #
#  #  #  #  #  #  #  #  #  #  #  #  #  #  #  #  #  #  #  #  # #                                                       #
#                                                             #
# #  #  #  #  #  #  #  #  #  #  #  #  #  #  #  #  #  #  #  #  #
#                                                             #
#  #  #  #  #  #  #  #  #  #  #  #  #  #  #  #  #  #  #  #  # #                                                       #
#                                                             #
# #  #  #  #  #  #  #  #  #  #  #  #  #  #  #  #  #  #  #  #  #
#                                                             #
#  #  #  #  #  #  #  #  #  #  #  #  #  #  #  #  #  #  #  #  # #                                                       #
#                                                             #
# #  #  #  #  #  #  #  #  #  #  #  #  #  #  #  #  #  #  #  #  #
#                                                             #
###############################################################
`;

let map2d;
//setup();

let slider;

let sprites = [];

function preload() {
    sprites.wall = loadImage("../../assets/wall.png");
}

function setup() {
    createCanvas(800, 600);
    map2d = new Map2d(path, sprites);
    // slider = createSlider(1, 360, 180, 10);
    // slider.position(10, height - 20);
    // slider.style('width', '80px');
}

function draw() {
    background(0);
    
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
    
    player.raysCount = 360;//slider.value();
    map2d.calc();
    
    

    let n = player.rays.length;
    let s = width / n;

    let m = 100;
    let l = (height / m) / 2;
    // for(let i = 0; i < m; i++) {
    //     let a = map(i, 0, m, 0, 255);
    //     noStroke();
    //     fill(255, 0, 0, a);
    //     rect(0, height/2 + i * l, width, l); 
    // }
    // for(let i = 0; i < m; i++) {
    //     let a = map(i, 0, m, 255, 0);
    //     noStroke();
    //     fill(0, 0, 255, a);
    //     rect(0, i * l, width, l); 
    // }
    
    player.draw3d(window);
    
    // for(let i = 0; i < n; i++) {
    //     let ray = player.rays[i];
    //     if (ray) {
    //         let h = ((height * 10) / (p5.Vector.sub(player.pos, ray.pos).mag() + 1));
    //         let a = map(h, (height * 0.5), height/20, 255, 0);
    //         noStroke();
    //         //noFill();
    //         //strokeWeight(0.1);
    //         fill(0, 255, 0, a);
    //         rect((i*s), height/2 - h/2, s, h);
    //     }
    // }

    map2d.draw(window);
    
    // for(let ray of player.rays) {
    //     let v = ray.calc();
    //     stroke("red");
    //     if (v) line(player.pos.x, player.pos.y, v.x, v.y);
    // }
    // textSize(20);
    // fill(255);
    // stroke(255);
    // text(`x: ${player.x}`, 10, 300);
    // text(`y: ${player.y}`, 10, 320);
    // text(`px: ${player.pos.x}`, 10, 340);
    // text(`py: ${player.pos.y}`, 10, 360);
    // text(`a: ${player.angle}`, 10, 380);
    text(frameRate(), 10, 400);
}