let SoundTrack = function() {

    this.currentTrackIndex = 0;

    this.initPlayList = function (){
        // Reset the playlist array to remove duplicates
        playlist = [];

        // Load all uploaded tracks into the playlist array asynchronously
        for (let i = 0; i < audioFiles.length; i++) {
            loadSound(audioFiles[i].url, (sound) => {
                playlist[i] = sound; // Store loaded sound
                if (i === 0) {
                    soundIsReady = true; // Mark first track as ready
                }
            }, (error) => {
                console.error(`Error loading track ${audioFiles[i].url}:`, error);
            });
        }

        this.trackEventListeners();
    };


    this.trackEventListeners = function () {
        //INITIALIZES THE EVENT LISTENER ON THE PLAYLIST MENU
        document.querySelectorAll(`.section-body-list .track-title`).forEach((item, index) => {
            let i = index
            item.addEventListener('click', (index) => { // CLICK TO REMOVE
                this.playTrack(i);
            });
        });
    }

    this.playTrack = function(index) {
        if (index !== false) {
            this.currentTrackIndex = index;
        }

        // Handle looping: if at the last track, restart to 0; if at -1, go to the last track
        if (this.currentTrackIndex >= playlist.length) {
            this.currentTrackIndex = 0;
        } else if (this.currentTrackIndex < 0) {
            this.currentTrackIndex = playlist.length - 1;
        }

        let selectedTrack = playlist[this.currentTrackIndex];

        // If the track isn't loaded yet, wait for it
        if (!selectedTrack || !selectedTrack.isLoaded()) {
            console.warn(`Track ${this.currentTrackIndex} not ready yet. Waiting...`);
            let checkInterval = setInterval(() => {
                if (selectedTrack && selectedTrack.isLoaded()) {
                    clearInterval(checkInterval);
                    this.playTrack(this.currentTrackIndex); // Retry once loaded
                }
            }, 100); // Check every 100ms
            return;
        }

        // Stop the currently playing track
        if (currentTrack && currentTrack.isPlaying()) {
            currentTrack.stop();
            controls.togglePlayBtn(document.querySelector(".play-button .material-symbols-outlined"));
        }

        // Play the selected track
        currentTrack = selectedTrack;
        currentTrack.play();

        durationInSeconds = currentTrack.duration();
        durationMinutes = Math.floor(durationInSeconds / 60);
        durationSeconds = Math.floor(durationInSeconds % 60);

        controls.togglePlayBtn(document.querySelector(".play-button .material-symbols-outlined"));
        controls.updateTrackTitle(audioFiles[this.currentTrackIndex].name);
    };


    this.togglePlay = function () {
        if (currentTrack && currentTrack.isPlaying()) {
            currentTrack.stop();
            controls.togglePlayBtn(document.querySelector(".play-button .material-symbols-outlined"));
        } else {
            this.playTrack(false);
            currentTrack.play();
        }
    }

    this.initPlayList();
    this.trackEventListeners();

}