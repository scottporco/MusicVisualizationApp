//global for the controls and input
var controls = null;
//store visualisations in a container
var vis = null;
//variable for the p5 sound object
var sound = null;
//variable for p5 fast fourier transform
var fourier;
// VARIABLE FOR VIS LIST
let visList;
// MY CODE HERE
let audioFiles = [{
	name:'stomper_reggae_bit.mp3',
	url: 'assets/stomper_reggae_bit.mp3',
}]
let soundFile = 'assets/stomper_reggae_bit.mp3';
let playlist = [];
let currentTrack = null;
let uploadSoundFile;
let playlistMenuConstructor;
let durationInSeconds, 
	durationMinutes, 
	durationSeconds, 
	elapsedTime, 
	elapsedMinutes, 
	elapsedSeconds;
let soundTrack;
// END MY CODE HERE

function preload() {
	currentTrack = loadSound(audioFiles[0].url);
}


function setup() {
	//create a new visualisation container and add visualisations
	vis = new Visualisations();
	vis.add(new Spectrum());
	vis.add(new WavePattern());
	vis.add(new Needles());

	controls = new ControlsAndInput();
	soundTrack = new SoundTrack();
	uploadSoundFile = new UploadFileConstructor();
	playlistMenuConstructor = new PlaylistMenuConstructor();


	background(45, 45, 42);

	// MY CODE STARTS HERE //

	// Create a full-window canvas & assign the canvas to the div with id "musicVisCanvas"
	let canvas = createCanvas(windowWidth, windowHeight - 80);
	canvas.parent("musicVisCanvas");

	controls.initialisePlayerBarUI(); //LOADING NEW PLAYER BAR UI HERE Since it is HTML
	uploadSoundFile.updateFileList(); // INIT THE DEFAULT TRACK

	// END OF MY CODE //
	//instantiate the fft object
	fourier = new p5.FFT();
}

function draw() {

	background(0);

	//draw the selected visualisation
	vis.selectedVisual.draw();
	controls.draw();
	audioFiles;
	// MY CODE HERE	

	if (currentTrack) {
		if (currentTrack.isPlaying()) {
			//GET ELAPSED TIME FROM AUDIO CLIP
			elapsedTime = currentTrack.currentTime();
			elapsedMinutes = Math.floor(elapsedTime / 60);
			elapsedSeconds = Math.floor(elapsedTime % 60);
			let formattedSeconds = String(elapsedSeconds).padStart(2, '0');
			controls.updateElapsedTime(`${elapsedMinutes}:${formattedSeconds} / ${durationMinutes}:${durationSeconds}`);
		}
	}

	// END MY CODE HERE

}

// Commenting this out for now.
// function mouseClicked(){
// 	controls.mousePressed();
// }
//
// function keyPressed(){
// 	controls.keyPressed(keyCode);
// }


//when the window has been resized. Resize canvas to fit
//if the visualisation needs to be resized call its onResize method
function windowResized() {
	resizeCanvas(windowWidth, windowHeight);
	if (vis.selectedVisual.hasOwnProperty('onResize')) {
		vis.selectedVisual.onResize();
	}
}
