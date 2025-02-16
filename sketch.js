//global for the controls and input 
var controls = null;
//store visualisations in a container
var vis = null;
//variable for the p5 sound object
var sound = null;
//variable for p5 fast fourier transform
var fourier;

// MY CODE HERE
let durationInSeconds,
	durationMinutes,
	durationSeconds,
	elapsedTime,
	elapsedMinutes,
	elapsedSeconds;
// END MY CODE HERE

function preload(){
	sound = loadSound('assets/stomper_reggae_bit.mp3');
}

function setup() {
	controls = new ControlsAndInput();
	background(45, 45, 42);

	// MY CODE STARTS HERE //
	durationInSeconds = sound.duration();
	durationMinutes = Math.floor(durationInSeconds / 60);
	durationSeconds = Math.floor(durationInSeconds % 60);

	// Create a full-window canvas & assign the canvas to the div with id "musicVisCanvas"
	let canvas = createCanvas(windowWidth, windowHeight - 80);
	canvas.parent("musicVisCanvas");
	controls.initialisePlayerBarUI(); //LOADING NEW PLAYER BAR UI HERE Since it is HTML

	// END OF MY CODE //

	//instantiate the fft object
	fourier = new p5.FFT();
	//create a new visualisation container and add visualisations
	vis = new Visualisations();
	vis.add(new Spectrum());
	vis.add(new WavePattern());
	vis.add(new Needles());


}

function draw(){
	background(0);
	//draw the selected visualisation
	vis.selectedVisual.draw();



	// MY CODE HERE
	if (sound.isPlaying()) {
		//GET ELAPSED TIME FROM AUDIO CLIP
		elapsedTime = sound.currentTime();
		elapsedMinutes = Math.floor(elapsedTime / 60);
		elapsedSeconds = Math.floor(elapsedTime % 60);
		let formattedSeconds = String(elapsedSeconds).padStart(2, '0');
		controls.updateElapsedTime(`${elapsedMinutes}:${formattedSeconds} / ${durationMinutes}:${durationSeconds}`);
	}
	// END MY CODE HERE

}

// Commenting this out for now.
// function mouseClicked(){
// 	controls.mousePressed();
// }

function keyPressed(){
	controls.keyPressed(keyCode);
}


//when the window has been resized. Resize canvas to fit 
//if the visualisation needs to be resized call its onResize method
function windowResized(){
	resizeCanvas(windowWidth, windowHeight);
	if(vis.selectedVisual.hasOwnProperty('onResize')){
		vis.selectedVisual.onResize();
	}
}
