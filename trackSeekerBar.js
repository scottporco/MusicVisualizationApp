let TrackSeekerBar = function () {
    this.trackLength = 0;
    this.playing = false;
    this.dragging = false;
    this.currentTime = 0;

    // Seeker bar properties
    this.barX = 0;
    this.barWidth = windowWidth; // Use dynamic window width
    this.barHeight = 5;
    this.barY = windowHeight - (this.barHeight + 15); // Adjust to window height

    this.knobRadius = 10;  // Increased knob size
    this.knobX;

    this.draw = function () {

        if (this.hidden) return; // Don't draw if hidden


        // Always update bar width and Y position dynamically
        this.barWidth = windowWidth;
        this.barY = windowHeight - (this.barHeight + 15);

        this.trackLength = currentTrack ? currentTrack.duration() : 0;
        this.playing = currentTrack && currentTrack.isPlaying();

        if (!this.dragging && this.playing) {
            this.currentTime = currentTrack.currentTime();
        }

        // Draw seeker background
        fill(45, 42, 42);
        rect(this.barX, this.barY-5, this.barWidth, 30);

        // Draw progress line
        fill(100, 0, 0);
        strokeWeight(0);
        rect(this.barX, this.barY-5, this.barWidth, this.barHeight);

        // Calculate progress
        let progress = map(this.currentTime, 0, this.trackLength, 0, this.barWidth);

        // Draw progress indicator
        fill(255, 0, 0);
        rect(this.barX, this.barY-5, progress, this.barHeight, 5);

        // Draw draggable knob (Now larger)
        this.knobX = this.barX + progress;
        fill(255, 0, 0);
        ellipse(this.knobX, this.barY-5 + this.barHeight / 2, this.knobRadius * 2, this.knobRadius * 2);

        this.cursorStyle(HAND);
    };

    this.cursorStyle = function (style) {
        let d = dist(mouseX, mouseY, this.knobX, this.barY + this.barHeight / 2);
        let grabRange = this.knobRadius + 5;  // Increase the grab range for easier interaction
        cursor(d < grabRange ? style : ARROW);
    };

    this.updateSeeker = function (x) {
        let clampedX = constrain(x, this.barX, this.barX + this.barWidth);
        let newTime = map(clampedX, this.barX, this.barX + this.barWidth, 0, this.trackLength);
        if (currentTrack) currentTrack.jump(newTime);
        this.currentTime = newTime;
    };

    this.toggleVisibility = function(isFullscreen) {
        if (isFullscreen) {
            this.hidden = true;  // Hide seek bar in fullscreen
        } else {
            this.hidden = false; // Show seek bar when exiting fullscreen
        }
    };

    // Ensure seek bar updates dynamically on window resize
    this.onResize = () => {
        this.barWidth = windowWidth; // Update seek bar width
        this.barY = windowHeight - (this.barHeight + 15); // Adjust Y position
        this.draw();
    };

};