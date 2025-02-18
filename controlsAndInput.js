//Constructor function to handle the onscreen menu, keyboard and mouse
//controls
function ControlsAndInput(){

	this.menuDisplayed = false;
	this.fs = fullscreen();
	//playback button displayed in the top left of the screen
	this.playbackButton = new PlaybackButton();
	this.visualizationData = {};
	this.playListData = [];

	// MY CODE HERE
	this.elapsedTimeMin = '0';
	this.elapsedTimeSec = '00';
	this.visualizationMenu;
	// END MY CODE HERE

	//make the window fullscreen or revert to windowed

	//responds to keyboard presses
	//@param keycode the ascii code of the keypressed
	// this.keyPressed = function(keycode){
	// 	console.log(keycode, key);
	// 	if(keycode == 32){
	// 		this.menuDisplayed = !this.menuDisplayed;
	// 	}
	//
	// 	if(keycode > 48 && keycode < 58){
	// 		var visNumber = keycode - 49;
	// 		vis.selectVisual(vis.visuals[visNumber].name);
	// 	}
	// 	return keycode;
	// };

	// Separate function for visualization item click handling
	this.handleVisualizationItemClick = function (item, index) {
		// Add custom click handling logic here
		console.log(item, index);
		this.selectVisualType(index);
	}

	this.selectVisualType = function(visNumber){
		vis.selectVisual(vis.visuals[visNumber].name);
	}

	this.cleanSoundFileName = function(filename){
		return filename.replace(/^assets\//, "");
	}



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

	// MY CUSTOM CODE STARTS HERE //
	this.updateElapsedTime = function (elapsedTime) {
		document.querySelector('.elapsed-time').innerHTML = `${elapsedTime}`
	}

	this.menu = function(){
		let list = [];
		//draw out menu items for each visualisation
		for(var i = 0; i < vis.visuals.length; i++){
			var yLoc = 70 + i*40;
			text((i+1) + ":  " +vis.visuals[i].name, 100, yLoc);
		}
		return list;
	};

	this.visualizationData = {
		title: 'Select a Visualisation',
		menuType:'visualization',
		addBtn: false,
		popUpData:vis.getVisualNamesArray(),

	};


	this.playListData = {
		title: 'My Playlist',
		menuType:'playlist',
		addBtn: true,
		popUpData: [],
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
					<p> ${this.cleanSoundFileName(soundFile)} </p>
				</div>
				
				<div class="player-bar-features flex-evenly-center">
				
					<div class="visualization-button relative">
						<span class="material-symbols-outlined white">
							key_visualizer
						</span>
					</div>
					
					<div class="playlist-button relative">
						<span class="material-symbols-outlined white">
							playlist_play
						</span>
					</div>
									
					<div class="fullscreen-button">
						<span class="material-symbols-outlined white">
							fullscreen
						</span>
					</div>
			
				</div>	
			</nav>
		`);

		let visualizationPopup = new PopUpConstructor(this.visualizationData);
		let playListPopup = new PopUpConstructor(this.playListData);

		// SET CLICK EVENTS HERE
		let playListButton
			= document.querySelector(
				".playlist-button"
		);

		let visualizationButton
			= document.querySelector(
			".visualization-button"
		);



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


		playListButton.addEventListener("click", () => {
			// Toggle playlist popup and handle callback
			playListPopup.toggle((isOpen) => {
				if (isOpen) {
					// Initialize and insert the popup into the button
					playListButton.innerHTML = playListPopup.initialisePopUp('play-list-popup') + playListButton.innerHTML;
				} else {
					// Remove the popup when closed
					document.querySelector('.play-list-popup')?.remove();
				}
			});
		});

		visualizationButton.addEventListener('click', (event)=>{
			//load popup
			visualizationPopup.toggle((callback)=>{
				if(callback){
					visualizationButton.innerHTML = visualizationPopup.initialisePopUp(`visualization-list-popup`) + visualizationButton.innerHTML;
					// Attach click event listeners to visualization items
					document.querySelectorAll('.visualization-item').forEach((item, index) => {
						item.addEventListener('click',()=>{
							this.handleVisualizationItemClick(item, index)
						});
					});
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


