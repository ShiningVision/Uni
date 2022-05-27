
var moved=false;
var clickDownPos=[0,0,0];
window.addEventListener("mousemove",(mouse)=>{
    var direction=[mouse.clientX, mouse.clientY,0];
    glMatrix.vec3.subtract(direction,clickDownPos,direction);
    if(moved){
        dragCamera(direction, clickDownPos);
    }
});

window.addEventListener("mousedown",(mouse)=>{
    clickDownPos=[mouse.clientX,mouse.clientY,0];
    moved=true;    
});

window.addEventListener("mouseup",(mouse)=>{
    moved=false;    
});

window.addEventListener("keydown",(keyboardInput)=>{
    var keyName=keyboardInput.key;
    switch(keyName){
        case "w":
            console.log( keyName+" was pressed");
            rotate(directions.UP);
            break;
        case "s":
            console.log( keyName+" was pressed");
            rotate(directions.DOWN);
            break;
        case "a":
            console.log( keyName+" was pressed");
            rotate(directions.LEFT);
            break;
        case "d":
            console.log( keyName+" was pressed");
            rotate(directions.RIGHT);
            break;
        case 'ArrowLeft':
            console.log( keyName+" was pressed");
            moveCamera(directions.LEFT);
            break;
        case 'ArrowRight':
            console.log( keyName+" was pressed");
            moveCamera(directions.RIGHT);
            break;
        case 'ArrowUp':
            console.log( keyName+" was pressed");
            moveCamera(directions.UP);
            break;
        case 'ArrowDown':
            console.log( keyName+" was pressed");
            moveCamera(directions.DOWN);
            break;
        default:
            return;
    }
},false)