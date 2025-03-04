let SoundTrack = function() {

    this.currentTrackIndex = 0;

    this.initPlayList = function (){
        //RESET THE ARRAY to remove the duplicates
        playlist=[];
        // Load all uploaded tracks into the playlist array
        for (let i = 0; i < audioFiles.length; i++) {
            playlist.push(audioFiles[i].url);
            playlist[i] = loadSound(playlist[i]);
        }
        this.trackEventListeners();
    }

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
        if (index != false){
            this.currentTrackIndex = index;
        }


        // Handle looping: if at the last track, restart to 0; if at -1, go to the last track
        if (this.currentTrackIndex >= playlist.length) {
            this.currentTrackIndex = 0;
        } else if (this.currentTrackIndex < 0) {
            this.currentTrackIndex = playlist.length - 1;
        }


        // Stop the currently playing track
        if (currentTrack && currentTrack.isPlaying()) {
            currentTrack.stop();
            controls.togglePlayBtn(document.querySelector(".play-button .material-symbols-outlined"));
        }

        // Play the selected track
        currentTrack = playlist[this.currentTrackIndex];
        currentTrack.play();

        durationInSeconds = currentTrack.duration();
        durationMinutes = Math.floor(durationInSeconds / 60);
        durationSeconds = Math.floor(durationInSeconds % 60);

        controls.togglePlayBtn(document.querySelector(".play-button .material-symbols-outlined"));
        controls.updateTrackTitle(audioFiles[this.currentTrackIndex].name);
    }

    this.resumePlay = function () {
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