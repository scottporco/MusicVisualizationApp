//Constructor function to handle the onscreen menu, keyboard and mouse
//controls
function ControlsAndInput(){

	this.menuDisplayed = false;
	this.fs = fullscreen();
	//playback button displayed in the top left of the screen
	this.playbackButton = new PlaybackButton();


	// MY CODE HERE
	this.elapsedTimeMin = '0';
	this.elapsedTimeSec = '00';
	// END MY CODE HERE

	//make the window fullscreen or revert to windowed

	//responds to keyboard presses
	//@param keycode the ascii code of the keypressed
	this.keyPressed = function(keycode){
		console.log(keycode, key);
		if(keycode == 32){
			this.menuDisplayed = !this.menuDisplayed;
		}

		if(keycode > 48 && keycode < 58){
			var visNumber = keycode - 49;
			vis.selectVisual(vis.visuals[visNumber].name); 
		}
		return keycode;
	};

	//draws the playback button and potentially the menu
	this.draw = function(){ // Commented out in sketch.js for now
		push();
		fill("white");
		stroke("black");
		strokeWeight(2);
		textSize(34);
		//playback button 
		this.playbackButton.draw();
		//only draw the menu if menu displayed is set to true.
		if(this.menuDisplayed){
			text("Select a visualisation:", 100, 30);
			this.menu();
		}
		pop();
	};

	this.menu = function(){
		//draw out menu items for each visualisation
		for(var i = 0; i < vis.visuals.length; i++){
			var yLoc = 70 + i*40;
			text((i+1) + ":  " +vis.visuals[i].name, 100, yLoc);
		}
	};

	// MY CUSTOM CODE STARTS HERE //
	this.updateElapsedTime = function (elapsedTime) {
		console.log(`${elapsedTime}`);
		document.querySelector('.elapsed-time').innerHTML = `${elapsedTime}`
	}

	this.initialisePlayerBarUI = function () {
		createDiv(`
			<nav class="player-bar flex-start-center">
				
				<div class="player-bar-control flex-center-center">
					<button class="prev-button">
					<span class="material-symbols-outlined white">
						skip_previous
					</span>
					</button>
					
					<button class="play-button">
						<span class="material-symbols-outlined white">
							play_arrow
						</span>
					</button>
					
					<button class="next-button">
						<span class="material-symbols-outlined white">
							skip_next
						</span>
					</button>
						
					<div class="elapsed-time">
						 ${this.elapsedTimeMin}:${this.elapsedTimeSec} / ${durationMinutes}:${durationSeconds}
					</div>
				</div>
				
				<div class="track-info">
					<p> TITLE OF THE TRACK THAT IS PLAYING... </p>
				</div>
				
				<div class="player-bar-features flex-evenly-center">
				
					<button class="visualization-button relative">
						<span class="material-symbols-outlined white">
							key_visualizer
						</span>
					</button>
					
					<button class="playlist-button relative">
						<span class="material-symbols-outlined white">
							playlist_play
						</span>
					</button>
									
					<button class="fullscreen-button">
						<span class="material-symbols-outlined white">
							fullscreen
						</span>
					</button>
			
				</div>	
			</nav>
		`);


		let playListPopup = new PopUpConstructor(['hi','hi','hi']);
		let visualizationPopup = new PopUpConstructor(['hi','hi','hi']);

		// SET CLICK EVENTS HERE
		let visualizationButton = document.querySelector(".visualization-button");
		let playListButton = document.querySelector(".playlist-button")

		let playButton = document.querySelector(".play-button");
		let playIcon = document.querySelector(".play-button .material-symbols-outlined");
		playButton.addEventListener("click", () => {
			if (sound.isPlaying()) {
				sound.pause();
				playIcon.innerHTML = "play_arrow";
			} else {
				sound.loop();
				playIcon.innerHTML = "pause";
			}
		})

		playListButton.addEventListener("click", (event) => {
			// Get relevant playlist information
			//load popup
			playListPopup.click((callback)=>{
				if(callback){
					playListButton.innerHTML = playListPopup.initialisePopUp('play-list-popup') + playListButton.innerHTML;
				} else {
					document.querySelector(`.play-list-popup`).remove();
				}
			});

		})

		visualizationButton.addEventListener('click', (event)=>{
			// Get relevant visualization info
			//load popup
			visualizationPopup.click((callback)=>{
				if(callback){
					visualizationButton.innerHTML = visualizationPopup.initialisePopUp(`visualization-list-popup`) + visualizationButton.innerHTML;
				} else {
					document.querySelector(`.visualization-list-popup`).remove();
				}
			});
		});

		let fullscreenButton = document.querySelector(".fullscreen-button");
		let playBar = document.querySelector(".player-bar");

		fullscreenButton.addEventListener("click", () => {
			fullscreen(!this.fs);
			playBar.classList.toggle("fullscreen");
		});

		// START: Got help on stackoverflow to make this work https://stackoverflow.com/a/37759224/7564279 //
		document.addEventListener('fullscreenchange', exitFullScreen);
		document.addEventListener('webkitfullscreenchange', exitFullScreen);
		document.addEventListener('mozfullscreenchange', exitFullScreen);
		document.addEventListener('MSFullscreenChange', exitFullScreen);

		function exitFullScreen() {
			if (!document.fullscreenElement && !document.webkitIsFullScreen && !document.mozFullScreen && !document.msFullscreenElement) {
				///fire your event
				if (fullscreen() !== true) {
					playBar.classList.toggle("fullscreen");
				}
			}
		} // END: Got help on stackoverflow to make this work //
	}
	// END OF MY CODE HERE //

}


