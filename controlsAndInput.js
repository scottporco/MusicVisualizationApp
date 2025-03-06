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


	// Separate function for visualization item click handling
	this.handleVisualizationItemClick = function (item, index) {
		// Add custom click handling logic here
		this.selectVisualType(index);
	}

	this.selectVisualType = function(visNumber){
		vis.selectVisual(vis.visuals[visNumber].name);
	}

	this.cleanSoundFileName = function(filename){
		return filename.replace(/^assets\//, "");
	}

	// MY CUSTOM CODE STARTS HERE //
	this.updateElapsedTime = function (elapsedTime) {
		document.querySelector('.elapsed-time').innerHTML = `${elapsedTime}`
	}

	this.menu = function(){
		let list = [];
		//draw out menu items for each visualisation
		for(var i = 0; i < vis.visuals.length; i++){
			var yLoc = 70 + i * 40;
			text((i+1) + ":  " +vis.visuals[i].name, 100, yLoc);
		}
		return list;
	};

	this.visualizationData = {
		title: 'Select a Visualisation',
		menuType:'visualization',
		addBtn: false,
		popUpData:[...vis.getVisualNamesArray()],

	};

	this.togglePlayBtn = function(selector){
		if (currentTrack.isPlaying()) {
			selector.innerHTML = "pause";
		} else {
			selector.innerHTML = "play_arrow";
		}
	}

	this.nextTrack = function(){
		soundTrack.playTrack(soundTrack.currentTrackIndex+1);
	}

	this.prevTrack = function(){
		soundTrack.playTrack(soundTrack.currentTrackIndex-1);
	}

	this.updateTrackTitle = function (track){
		document.querySelector('.track-info p').innerHTML = this.cleanSoundFileName(track);
	}

	this.playListData = {
		title: 'My Playlist',
		menuType:'playlist',
		addBtn: true,
		popUpData: [],
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
		this.playListData.popUpData = audioFiles;
	};


	this.visualizationPopup = new PopUpConstructor(this.visualizationData, `visualization-list-popup`);
	this.playListPopup = new PopUpConstructor(this.playListData, 'play-list-popup');


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
						 
					</div>
				</div>
				
				<div class="track-info">
					<p>  </p>
				</div>
				
				<div class="player-bar-features flex-evenly-center">
				
					<div class="visualization-ui-hook relative">
						<span class="visualization-event material-symbols-outlined white">
							key_visualizer
						</span>
					</div>
					
					<div class="playlist-ui-hook relative">
						<span class="playlist-event material-symbols-outlined white">
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

		let prevButton = document.querySelector('.prev-button');
		let nextButton = document.querySelector('.next-button');

		let visualizationUIHook = document.querySelector(".visualization-ui-hook");
		visualizationUIHook.innerHTML += this.visualizationPopup.initialisePopUp();

		let playListUIHook = document.querySelector(".playlist-ui-hook");
		playListUIHook.innerHTML += this.playListPopup.initialisePopUp();

		// SET CLICK EVENTS HERE
		let playListButton = document.querySelector(".playlist-event");
		let visualizationButton= document.querySelector(".visualization-event");


		let playButton = document.querySelector(".play-button");
		let playIcon = document.querySelector(".play-button .material-symbols-outlined");

		prevButton.addEventListener("click", this.prevTrack);
		nextButton.addEventListener("click", this.nextTrack);

		playButton.addEventListener("click", () => {
			if (currentTrack.isPlaying()) {
				currentTrack.pause(); // Pause the track
				playIcon.innerHTML = "play_arrow";
			} else {
				// Resume from last paused position
				if (typeof currentTrack.resume === "function") {
					currentTrack.resume();
				} else {
					currentTrack.play(); // Fallback if `resume()` doesn't exist
				}
				playIcon.innerHTML = "pause";
			}
		});

		playListButton.addEventListener("click", () => {
			// Toggle playlist popup and handle callback
			this.playListPopup.toggle((isOpen) => {
				if (isOpen) {
					playlistMenuConstructor.draw();
					uploadSoundFile.uploadFile( (status) => {
						if (status === "success") {
							this.playListData.popUpData = audioFiles;
							playlistMenuConstructor.draw();
							soundTrack.trackEventListeners();
						}
					});
				}
			});
		});


		visualizationButton.addEventListener('click', (event)=> {
			//load popup
			this.visualizationPopup.toggle((isOpen)=>{
				if(isOpen){
					// Attach click event listeners to visualization items
					document.querySelectorAll('.visualization-item').forEach((item, index) => {
						item.addEventListener('click',()=>{
							this.handleVisualizationItemClick(item, index)
						});
					});
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

		document.addEventListener("click", (event) => {
			const playListPopupElement = document.querySelector(".play-list-popup");
			const visualizationPopupElement = document.querySelector(".visualization-list-popup");

			// Check if the click was inside any popup or their toggle buttons
			const clickedInsidePopup =
				(playListPopupElement && playListPopupElement.contains(event.target)) ||
				(visualizationPopupElement && visualizationPopupElement.contains(event.target)) ||
				event.target.closest(".playlist-event") ||
				event.target.closest(".visualization-event");

			if (!clickedInsidePopup) {
				if (this.playListPopup.isOpen) {
					this.playListPopup.toggle();
				}
				if (this.visualizationPopup.isOpen) {
					this.visualizationPopup.toggle();
				}
			}
		});

	}
	// END OF MY CODE HERE //

}


