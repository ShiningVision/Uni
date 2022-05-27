
var moved = false;
var clickDownPos = [0, 0, 0];
window.addEventListener("mousemove", (mouse) => {
	var direction = [mouse.clientX, mouse.clientY, 0];
	glMatrix.vec3.subtract(direction, clickDownPos, direction);
	if (moved) {
		dragCamera(direction, clickDownPos);
	}
});

window.addEventListener("mousedown", (mouse) => {
	clickDownPos = [mouse.clientX, mouse.clientY, 0];
	moved = true;
});

window.addEventListener("mouseup", (mouse) => {
	moved = false;
});

window.addEventListener("keydown", (keyboardInput) => {
	var keyName = keyboardInput.key;
	switch (keyName) {
		case "i":
			console.log(keyName + " was pressed");
			rotate(axes.XRIGHT);
			break;
		case "k":
			console.log(keyName + " was pressed");
			rotate(axes.XLEFT);
			break;
		case "o":
			console.log(keyName + " was pressed");
			rotate(axes.YRIGHT);
			break;
		case "u":
			console.log(keyName + " was pressed");
			rotate(axes.YLEFT);
			break;
		case "l":
			console.log(keyName + " was pressed");
			rotate(axes.ZRIGHT);
			break;
		case "j":
			console.log(keyName + " was pressed");
			rotate(axes.ZLEFT);
			break;
		case "a":
			console.log(keyName + " was pressed");
			scale('x', 0.9);
			break;
		case "s":
			console.log(keyName + " was pressed");
			scale('y', 0.9);
			break;
		case "d":
			console.log(keyName + " was pressed");
			scale('z', 0.9);
			break;
		case "A":
			console.log(keyName + " was pressed");
			scale('x', 1.1);
			break;
		case "S":
			console.log(keyName + " was pressed");
			scale('y', 1.1);
			break;
		case "D":
			console.log(keyName + " was pressed");
			scale('z', 1.1);
			break;
		case 'ArrowLeft':
			console.log(keyName + " was pressed");
			if (activeCamera == true)
				moveCamera(directions.LEFT);
			else { translate(axes.XRIGHT); }
			break;
		case 'ArrowRight':
			console.log(keyName + " was pressed");
			if (activeCamera == true)
				moveCamera(directions.RIGHT);
			else { translate(axes.XLEFT); }
			break;
		case 'ArrowUp':
			console.log(keyName + " was pressed");
			if (activeCamera == true)
				moveCamera(directions.UP);
			else { translate(axes.YLEFT); }
			break;
		case 'ArrowDown':
			console.log(keyName + " was pressed");
			if (activeCamera == true)
				moveCamera(directions.DOWN);
			else { translate(axes.YRIGHT); }
			break;
		case ',':
			console.log(keyName + " was pressed");
			translate(axes.ZLEFT);
			break;
		case '.':
			console.log(keyName + " was pressed");
			translate(axes.ZRIGHT);
			break;
		case '1':
			console.log(keyName + " was pressed");
			pressNumber(1);
			break;
		case '2':
			console.log(keyName + " was pressed");
			pressNumber(2);
			break;
		case '3':
			console.log(keyName + " was pressed");
			pressNumber(3);
			break;
		case '4':
			console.log(keyName + " was pressed");
			pressNumber(4);
			break;
		case '5':
			console.log(keyName + " was pressed");
			pressNumber(5);
			break;
		case '6':
			console.log(keyName + " was pressed");
			pressNumber(6);
			break;
		case '7':
			console.log(keyName + " was pressed");
			pressNumber(7);
			break;
		case '8':
			console.log(keyName + " was pressed");
			pressNumber(8);
			break;
		case '9':
			console.log(keyName + " was pressed");
			pressNumber(9);
			break;
		case '0':
			console.log(keyName + " was pressed");
			if (focusOnAllShapes == true) {
				focusOnAllShapes = false;
				render();
				break;
			}
			focusOnSingleShape = false;
			focusOnAllShapes = true;
			shapes.forEach(shape => {
				shape.focus = true;
			})
			render();
			break;
		case 'c':
			console.log(keyName + " was pressed");
			/*for some reason this line of code only works after clicking twice on c.*/
			//activeCamera=!activeCamera;
			/*Guess I will use the old fashioned method*/
			if (activeCamera == true) {
				activeCamera = false;
			} else {
				activeCamera = true;
			}
			break;
		case 'w':
			console.log(keyName + " was pressed");
			shaderPrograms.gDiffuse.enable();
			render();
			break;
		case 'e':
			console.log(keyName + " was pressed");
			shaderPrograms.gSpecular.enable();
			render();
			break;
		case 'r':
			console.log(keyName + " was pressed");
			shaderPrograms.pDiffuse.enable();
			render();
			break;
		case 't':
			console.log(keyName + " was pressed");
			shaderPrograms.pSpecular.enable();
			render();
			break;
		case 'L':
			console.log(keyName + " was pressed");
			activeLightSource = !activeLightSource;

		default:
			return;
	}
}, false)

//private function for keydown 1-9:
function pressNumber(num) {
	if (focusOnSingleShape == true && shapes[num - 1].focus == true) {
		shapes[num - 1].focus = false;
		focusOnSingleShape = false;
		render();
		return;
	}
	focusOnSingleShape = true;
	focusOnAllShapes = false;
	shapes.forEach(shape => {
		shape.focus = false;
	})
	shapes[num - 1].focus = true;
	render();
}