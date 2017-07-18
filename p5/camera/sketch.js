var camera;

function setup() {
	background(0);
	createCanvas(800,600,WEBGL);
	camera = createCapture(VIDEO);
	camera.size(800,600);
	camera.hide();

}

function draw() {
  background(0);
  rotateY(radians(180));
  //box();
  plane(800);
  texture(camera, 0,0,800*2,600*2);

}