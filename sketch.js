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

let playlist = [],
	currentTrack = null,
	uploadSoundFile,
	playlistMenuConstructor,
	durationInSeconds,
	durationMinutes, 
	durationSeconds, 
	elapsedTime, 
	elapsedMinutes, 
	elapsedSeconds,
	soundTrack,
	soundIsReady = false,
	windowWidth,
	windowHeight,
	trackSeekerBar;
// END MY CODE HERE

function preload() {
	currentTrack = loadSound(audioFiles[0].url, soundLoaded);
}

let soundLoaded = function() {
	console.log('Sound file loaded!', currentTrack);
	soundIsReady = true; // This is a flag to check if it's ready.
}

function setup() {
	windowWidth = window.innerWidth;
	windowHeight = (window.innerHeight - 80);
	//create a new visualisation container and add visualisations
	vis = new Visualisations();
	vis.add(new Spectrum());
	vis.add(new WavePattern());
	vis.add(new Needles());
	vis.add(new CircularWaveWeather());
	vis.add(new QuoteVisualization());

	controls = new ControlsAndInput();
	soundTrack = new SoundTrack();
	uploadSoundFile = new UploadFileConstructor();
	playlistMenuConstructor = new PlaylistMenuConstructor();
	trackSeekerBar = new TrackSeekerBar();

	background(45, 45, 42);

	// MY CODE STARTS HERE //

	// Create a full-window canvas & assign the canvas to the div with id "musicVisCanvas"
	let canvas = createCanvas(windowWidth, windowHeight);
	canvas.parent("musicVisCanvas");

	controls.initialisePlayerBarUI(); //LOADING NEW PLAYER BAR UI HERE Since it is HTML
	uploadSoundFile.updateFileList(); // INIT THE DEFAULT TRACK

	// END OF MY CODE //
	//instantiate the fft object
	fourier = new p5.FFT();

	/*
	* This setTimeout was a solution to load the initial track into the SoundTrack Constructor on first time app load.
	* */
	setTimeout(function (){
		if (soundIsReady) {
			// currentTrack.play();
			if (currentTrack) {
				soundTrack.playTrack(soundTrack.currentTrackIndex + 1); // If already loaded from Preload, play immediately
				soundTrack.togglePlay();
			}
		} else {
			// Wait until sound is ready before playing
			let checkInterval = setInterval(() => {
				if (soundIsReady) {
					// currentTrack.play();
					if (currentTrack) {
						soundTrack.playTrack(soundTrack.currentTrackIndex + 1); // If already loaded from Preload, play immediately
						soundTrack.togglePlay();
					}
					clearInterval(checkInterval);
				}
			}, 100); // Check every 100ms
		}
	}, 1000)

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

	trackSeekerBar.draw();

	// END MY CODE HERE

}


function windowResized() {
	// Update global window dimensions
	windowWidth = window.innerWidth;
	windowHeight = window.innerHeight - 80;

	if (vis.selectedVisual.hasOwnProperty('onResize')) {
		vis.selectedVisual.onResize();
	}

	// Resize canvas
	resizeCanvas(windowWidth, windowHeight);

	// Update seek bar dimensions
	if (trackSeekerBar) {
		console.log("Reinitializing seek bar after resize");
		trackSeekerBar.barWidth = windowWidth; // Adjust width after resizing
		trackSeekerBar.draw(); // Force redraw
	}
}