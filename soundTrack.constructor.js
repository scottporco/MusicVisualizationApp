let SoundTrack = function() {

    this.currentTrackIndex;

    this.initPlayList = function (){
        console.log('initPlayList');
        //RESET THE ARRAY to remove the duplicates
        playlist=[];
        // Load all uploaded tracks into the playlist array
        for (let i = 0; i < audioFiles.length; i++) {
            playlist.push(audioFiles[i].url);
            playlist[i] = loadSound(playlist[i]);
        }
        this.trackEventListeners();
        console.log(playlist);
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
        this.currentTrackIndex = index;
        // Stop the currently playing track
        if (currentTrack && currentTrack.isPlaying()) {
            currentTrack.stop();
            controls.togglePlayBtn(document.querySelector(".play-button .material-symbols-outlined"));
        }

        // Play the selected track
        currentTrack = playlist[index];
        currentTrack.play();

        durationInSeconds = currentTrack.duration();
        durationMinutes = Math.floor(durationInSeconds / 60);
        durationSeconds = Math.floor(durationInSeconds % 60);

        controls.togglePlayBtn(document.querySelector(".play-button .material-symbols-outlined"));
        controls.updateTrackTitle(audioFiles[index].name);



    }

    this.initPlayList();
    this.trackEventListeners();

}