let TrackSeekerBar = function () {
    this.trackLength = 0; // Get total track duration in seconds
    this.playing = false; // Track playing state
    this.dragging = false; // Flag for dragging the seeker
    this.currentTime = 0; // Init current time
    // Seeker bar properties
    this.barX = 0;
    this.barY = 0;
    this.barWidth = 0;
    this.barHeight = 5; // Slimmer bar for better visuals
    this.knobX;
    this.draw = function () {
        this.barWidth = width;
        this.trackLength = currentTrack.duration();
        this.barY = height - (this.barHeight + 15);
        this.playing = currentTrack.isPlaying(); // Ensure `this.playing` is always in sync

        // Always get the latest playback time from the track
        if (!this.dragging && this.playing) { // Only update when playing
            this.currentTime = currentTrack.currentTime();
        }

        // Draw the seeker bar background
        fill(45, 42, 42);
        rect(this.barX, height - (this.barHeight + 10), width, 30);

        // Draw the seeker bar line
        fill(100, 0 , 0);
        stroke(45, 42, 42);
        strokeWeight(0);
        rect(this.barX, this.barY, width, this.barHeight);


        // Calculate progress (fixing movement)
        let progress = map(this.currentTime, 0, this.trackLength, 0, this.barWidth);

        // Draw the progress indicator
        fill(255, 0, 0);
        rect(this.barX, this.barY, progress, this.barHeight, 5);

        // Draw the draggable knob (Red color)
        this.knobX = (this.barX+8) + progress; // Fixing knob movement
        fill(255, 0, 0); // Red knob
        ellipse(this.knobX, this.barY + this.barHeight / 2, 15, 15);

        this.cursorStyle(HAND);

    };

    this.cursorStyle = function (style) {
        let d = dist(mouseX, mouseY, this.knobX, this.barY + this.barHeight / 2);
        if (d < 15/2) {
            cursor(style); // Change cursor to pointer (hand)
        } else {
            cursor(ARROW); // Default cursor
        }
    }

    this.updateSeeker = function (x) {
        let clampedX = constrain(x, this.barX, this.barX + this.barWidth);
        let newTime = map(clampedX, this.barX, this.barX + this.barWidth, 0, this.trackLength);
        currentTrack.jump(newTime); // Seek track
        this.currentTime = newTime; // Update displayed time
    };

    this.mousePressed = () => {
        if (mouseY > this.barY && mouseY < this.barY + this.barHeight) {
            this.cursorStyle(MOVE);
            this.updateSeeker(mouseX);
            this.dragging = true;
        }
    };

    this.mouseDragged = () => {
        if (this.dragging) {
            this.updateSeeker(mouseX);
        }
    };

    this.mouseReleased = () => {
        this.dragging = false;
    };

    this.keyPressed = () => {
        if (key === ' ') {
            if (currentTrack.isPlaying()) {
                currentTrack.pause();
                this.playing = false; // Sync playing state
            } else {
                currentTrack.play();
                this.playing = true; // Sync playing state
            }
        }
    };

    window.addEventListener("resize", () => {
        if (soundTrack.currentTrack && soundTrack.currentTrack.isPlaying()) {
            let currentTime = soundTrack.currentTrack.currentTime(); // Get current position
            console.log("Saving seek position:", currentTime);

            setTimeout(() => {
                soundTrack.currentTrack.jump(currentTime); // Restore position after resize
                console.log("Restoring seek position:", currentTime);
            }, 100);
        }
    });

    // Attach event listeners globally
    window.mousePressed = this.mousePressed;
    window.mouseDragged = this.mouseDragged;
    window.mouseReleased = this.mouseReleased;
    window.keyPressed = this.keyPressed;
};