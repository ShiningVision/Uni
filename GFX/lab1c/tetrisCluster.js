

class TetrisCluster {

    constructor() {
        this.cubes = [];
    }

    initData(cubes) {
        cubes.forEach((cube) => {
            this.cubes.push(cube);
        })
    }

    collide() {
        for (let i = 0; i < this.cubes.length; i++) {
            if (this.cubes[i].collide()) return true;
        }
        return false;
    }

    rotate(angle, axe) {
        this.cubes.forEach((c) => {
            c.rotate(angle, axe);
        })
    }

    translate(axe) {
        this.cubes.forEach((c) => {

            c.translate(axe);
        })
    }

    draw() {
        this.cubes.forEach(c => {
            c.draw();
        })
    }

    addToCollidableObjects() {
        this.cubes.forEach((c) => {
            let coord = c.getCoordinate();
            let thisBlock = [coord[0], coord[1] + 1, coord[2]];
            collisionCoordinates.push(thisBlock);
        })
    }


    checkTileAboveCeiling() {
        let flag=false;
        this.cubes.forEach((c) => {
            let coord = c.getCoordinate();
            if(coord[1]+1>=ceiling){
                flag=true;
            }
        })
        return flag;
    }
}


function createTetra() {
    //tetrisRotation is defined in globals.js
    let num = tetrisRotation;
    tetrisRotation = num + 1;
    if (tetrisRotation > 8) tetrisRotation = 1;

    switch (num) {
        case 1:
            return createTetra1();
        case 2:
            return createTetra2();
        case 3:
            return createTetra3();
        case 4:
            return createTetra4();
        case 5:
            return createTetra5();
        case 6:
            return createTetra6();
        case 7:
            return createTetra7();
        case 8:
            return createTetra8();
        default:
            console.log("ERROR: the tetris object with number: " + num + " does not exist!");
            return;
    }

}

function createTetra1() {
    var cube1 = new TetrisCube(defaultColors[0]);
    var cube2 = new TetrisCube(defaultColors[0]);
    var cube3 = new TetrisCube(defaultColors[0]);
    var cube4 = new TetrisCube(defaultColors[0]);
    cube2.translateUp();
    cube3.translateUp();
    cube3.translateUp();
    cube4.translateUp();
    cube4.translateUp();
    cube4.translateUp();
    var cluster = new TetrisCluster();
    cluster.initData([cube1, cube2, cube3, cube4]);
    return cluster;
}

function createTetra2() {
    var cube1 = new TetrisCube(defaultColors[1]);
    var cube2 = new TetrisCube(defaultColors[1]);
    var cube3 = new TetrisCube(defaultColors[1]);
    var cube4 = new TetrisCube(defaultColors[1]);
    cube2.translateRight();
    cube3.translateDown();
    cube4.translateRight();
    cube4.translateDown();
    var cluster = new TetrisCluster();
    cluster.initData([cube1, cube2, cube3, cube4]);
    return cluster;
}

function createTetra3() {
    var cube1 = new TetrisCube(defaultColors[2]);
    var cube2 = new TetrisCube(defaultColors[2]);
    var cube3 = new TetrisCube(defaultColors[2]);
    var cube4 = new TetrisCube(defaultColors[2]);
    cube2.translateLeft();
    cube3.translateDown();
    cube4.translateRight();
    cube4.translateDown();
    var cluster = new TetrisCluster();
    cluster.initData([cube1, cube2, cube3, cube4]);
    return cluster;
}

function createTetra4() {
    var cube1 = new TetrisCube(defaultColors[3]);
    var cube2 = new TetrisCube(defaultColors[3]);
    var cube3 = new TetrisCube(defaultColors[3]);
    var cube4 = new TetrisCube(defaultColors[3]);
    cube2.translateLeft();
    cube3.translateRight();
    cube4.translateUp();
    cube4.translateRight();
    var cluster = new TetrisCluster();
    cluster.initData([cube1, cube2, cube3, cube4]);
    return cluster;
}

function createTetra5() {
    var cube1 = new TetrisCube(defaultColors[4]);
    var cube2 = new TetrisCube(defaultColors[4]);
    var cube3 = new TetrisCube(defaultColors[4]);
    var cube4 = new TetrisCube(defaultColors[4]);
    cube2.translateLeft();
    cube3.translateRight();
    cube4.translateUp();
    var cluster = new TetrisCluster();
    cluster.initData([cube1, cube2, cube3, cube4]);
    return cluster;
}

function createTetra6() {
    var cube1 = new TetrisCube();
    var cube2 = new TetrisCube();
    var cube3 = new TetrisCube();
    var cube4 = new TetrisCube();
    cube2.translateLeft();
    cube3.translateDown();
    cube4.translateForth();
    var cluster = new TetrisCluster();
    cluster.initData([cube1, cube2, cube3, cube4]);
    return cluster;
}

function createTetra7() {
    var cube1 = new TetrisCube();
    var cube2 = new TetrisCube();
    var cube3 = new TetrisCube();
    var cube4 = new TetrisCube();
    cube2.translateRight();
    cube3.translateUp();
    cube4.translateRight();
    cube4.translateForth();
    var cluster = new TetrisCluster();
    cluster.initData([cube1, cube2, cube3, cube4]);
    return cluster;
}

function createTetra8() {
    var cube1 = new TetrisCube();
    var cube2 = new TetrisCube();
    var cube3 = new TetrisCube();
    var cube4 = new TetrisCube();
    cube2.translateRight();
    cube3.translateUp();
    cube4.translateUp();
    cube4.translateForth();
    var cluster = new TetrisCluster();
    cluster.initData([cube1, cube2, cube3, cube4]);
    return cluster;
}