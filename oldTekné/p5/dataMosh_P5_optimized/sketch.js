
/*

 0 = black
 1 = brightness
 2 = white

 */

var loopNB = 0;
var mode = 1;

// image path is relative to sketch directory
var img;
var originalPic;
var imgFileName = "testDataMosh";
var fileType = "jpg";

var loops = 1;

// threshold values to determine sorting start and end pixels
var blackValue = -16000000;
var brightnessValue = 60;
var whiteValue = -13000000;

var row = 0;
var column = 0;

var saved = false;

var capture;
var w = 640,
    h = 480;
var live = 1;
var captured = 0;
var final;

var xStartGlitch;// = 200;
var xStopGlitch;// = 400;
var yStartGlitch;// = 300;

//Face Detection stuffs
var entireImage = 0;

var detector;
var classifier = objectdetect.frontalface;
var faces;

var saved = 0;



///////////////////////////////////////////////////////////////////////
function setup() {

    capture = createCapture(VIDEO);
    createCanvas(w, h);
    capture.size(w, h);
    capture.hide();


    //select('#motion').elt.innerText = "entering setup()";
    background(0);
    createCanvas(w,h);

    img = new p5.Image(w,h);
    originalPic = new p5.Image(w,h);

    console.log("end setup ");


    //HERE WE CHOOSE A START VALUE FOR X. Remove to glitch from x=0.//
    if(entireImage == 1)
        xStopGlitch = img.width-1;


    //Face Detection stuffs
    var scaleFactor = 2.0;
    detector = new objectdetect.detector(w, h, scaleFactor, classifier);

    //select("#takePhoto").hide();
    select("#saveImg").hide();
    select("#restart").hide();

}


///////////////////////////////////////////////////////////////////////
function draw() {


    if(live == 0 && captured == 1)
    {
        // loop through columns
        while(column < /*(img.width-1)*/ xStopGlitch) {
            img.loadPixels(); 
            sortColumn();
            column++;
            img.updatePixels();
        }

        //console.log("########## fin du while #########");

        image(img, 0, 0, w, h);
        //image(originalPic, 0, h+20, w, h);

        /*
        if(saved == 0)
            {
                saveCanvas(img.canvas, "Blindsp0t_GlitySelfie", "png");
                saved=1;
            }
            */
        //Draw Detected Faces
        /*
        stroke(255);
        noFill();
        if (faces) {
            faces.forEach(function (face) {
                var count = face[4];
                if (count > 5) { // try different thresholds
                    rect(face[0], face[1], face[2], face[3]);
                }
            })
        }
        ellipse(xStartGlitch, yStartGlitch,10);
        ellipse(xStopGlitch, img.height,10);
*/
    }


    if(live==1)
    {
        capture.loadPixels();
        image(capture, 0, 0, w, h);
        /*
        //Draw Detected Faces
        //img.loadPixels(); 
        faces = detector.detect(capture.canvas);    

        stroke(255);
        noFill();
        if (faces) {
            faces.forEach(function (face) {
                var count = face[4];
                if (count > 5) { // try different thresholds
                    rect(face[0], face[1], face[2], face[3]);
                }
            })
        }*/
    }

}


function x() {
    window.open(canvas.toDataURL('image/png'));
    var gh = canvas.toDataURL('png');

    var a  = document.createElement('a');
    a.href = gh;
    a.download = 'Blindsp0t_GlitySelfie.png';

    a.click()
}

function clickTakePhoto()
{
    live = 0;

    if(captured == 0)
    {
        img.copy(capture,0,0,w,h,0,0,w,h);
        originalPic.copy(capture,0,0,w,h,0,0,w,h);
        //img.updatePixels();
        img.loadPixels();

        //    xStartGlitch = 100;
        //    xStopGlitch = 540;
        //    yStartGlitch = 100;

        faces = detector.detect(img.canvas);    
        console.log(faces.length);

        if (faces && entireImage == 0) {
            var nbFaces = 0;
            faces.forEach(function (face) {
                //console.log("count : " + count);
                var count = face[4];
                if (count > 2) { // try different thresholds
                    //rect(face[0], face[1], face[2], face[3]);
                    nbFaces++;

                    xStartGlitch = face[0];
                    xStopGlitch = face[0]+face[2];
                    yStartGlitch = face[1];
                }
            })
        }
        if(nbFaces > 0)
        {
            console.log("face found")    ;
        }
        else
        {
            //alert("no face found, please try again...");
            select('#motion').elt.innerText = "no face found, glitched entire image ";
            entireImage = 1;
            xStartGlitch = 0;
            xStopGlitch = w;
            yStartGlitch = 0;
        }


        captured=1;


        if(entireImage == 0)
        {
            column = xStartGlitch;
        }
    }

    select("#takePhoto").hide();
    select("#saveImg").show();
    select("#restart").show();

    /*
    console.log("xStartGlitch : " + xStartGlitch);
    console.log("xStopGlitch : " + xStopGlitch);
    console.log("yStartGlitch : " + yStartGlitch);
*/


}

function save2() {
    /*
    window.open(canvas.toDataURL('image/png'));
    var gh = canvas.toDataURL('png');

    var a  = document.createElement('a');
    a.href = gh;
    a.download = 'image.png';

    a.click()
    */
    /*var canvas = document.getElementById("my-canvas"),*/ var  ctx = canvas.getContext("2d");
    // draw to canvas...
    canvas.toBlob(function(blob) {
        saveAs(blob, "yourGlitchSelfie.png");
    });
}


///////////////////////////////////////////////////////////////////////
function sortColumn() {

    var x = column;


    var y;
    if(entireImage == 0)
    {
        y = yStartGlitch;
    }
    else
    {
        y = 0;
    }

    var yend = 0;

    loopNB++;

    while(yend < img.height-1) {
        switch(mode) {
            case 0:
                y = getFirstNotBlackY(x, y);
                yend = getNextBlackY(x, y);
                break;
            case 1:
                y = getFirstBrightY(x, y);
                yend = getNextDarkY(x, y);
                break;
            case 2:
                y = getFirstNotWhiteY(x, y);
                yend = getNextWhiteY(x, y);
                break;
            default:
                break;
                   }

        if(y < 0) break;

        var sortLength = yend-y;
        if(sortLength < 0) break;

        var unsorted = new Array([sortLength]) ; 
        var sorted = new Array([sortLength]) ;

        for(var i=0; i<sortLength; i++) {

            unsorted[i] = rgbToHex(getRedAt(x,y+i), getGreenAt(x,y+i), getGreenAt(x,y+i));
        }

        sorted = sort(unsorted, sortLength);

        for(var i=0; i<sortLength; i++) {
            img.set(x, (y+i), color("#" + sorted[i])/*color(255,0,0)*/);
        }
        img.updatePixels();

        y = yend+1;
    }
}


function getRedAt(x, y)
{    
    var index;
    if(y>0)
        index = parseInt(x + ((y) * img.width)) * 4;
    else
        index = parseInt(x*4);

    return img.pixels[index];
}

function getGreenAt(x, y)
{
    var index;
    if(y>0)
        index = parseInt(x + ((y) * img.width)) * 4;
    else
        index = parseInt(x*4);

    return img.pixels[index + 1];
}

function getBlueAt(x, y)
{
    var index;
    if(y>0)
        index = parseInt(x + ((y) * img.width)) * 4;
    else
        index = parseInt(x*4);

    return img.pixels[index + 2];
}

///////////////////////////////////////////////////////////////////////
function getFirstBrightY( x,  y) 
{
    var localY = y;
    var localX = x;

    if(localY >= img.height) {return -1;}

    while( max( getRedAt(x,localY),getGreenAt(x,localY),getBlueAt(x,localY)) < brightnessValue) {

        localY++; 

        if(localY >= img.height)
        {
            return -1;
        }
    }

    return localY;
}


///////////////////////////////////////////////////////////////////////
function getNextDarkY( x,  y) 
{
    var localY = y;
    var localX = x;

    localY++;

    if(localY >= img.height) {return img.height-1;}

    while( max( getRedAt(x,localY),getGreenAt(x,localY),getBlueAt(x,localY)) > brightnessValue) {

        localY++; 

        if(localY >= img.height)
            return img.height-1;
    }
    return (localY-1);
}


///////////////////////////////////////////////////////////////////////
function rgbToHex(r, g, b) 
{
    return /*"#" +*/ ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}


///////////////////////////////////////////////////////////////////////
function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}