var camera;

function setup() {
	background(0);
	createCanvas(800,600);
	camera = createCapture(VIDEO);
	camera.size(640,480);
	camera.hide();

}

function draw() {
  background(0);
  image(camera, 0,0,640,480); 

}