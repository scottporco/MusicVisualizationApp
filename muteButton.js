let MuteButton = function() {

    this.size = 40; // Button size
    this.x = windowWidth - this.size - 10; // Top-right position
    this.y = 10;

    this.muted = false; // Initial state

    this.draw = function() {
        pop();
            fill(50);
            stroke(200);
            strokeWeight(2);
            rect(this.x, this.y, this.size, this.size, 10); // Draw button

            // Draw icon (mute/unmute)
            fill(255);
            noStroke();
            textSize(24);
            textAlign(CENTER, CENTER);
            textFont("Material Symbols Outlined");
            fill(255);
            text(this.muted ? "volume_off" : "volume_up", this.x + this.size / 2, this.y + this.size / 2 + 5);
            // Source on help --> https://www.reddit.com/r/processing/comments/c8nhkt/using_specific_google_fonts_in_the_p5js_web/?rdt=63920 <-- \\
        push();
        // Reset font to sans-serif for other UI elements
        textFont("sans-serif");
    };

    this.handleClick = function() {
        if (
            mouseX > this.x && mouseX < this.x + this.size &&
            mouseY > this.y && mouseY < this.y + this.size
        ) {
            this.toggle();
        }
    };


    this.toggle = function() {
        this.muted = !this.muted;
        if (currentTrack) {
            if (this.muted) {
                currentTrack.setVolume(0);
            } else {
                currentTrack.setVolume(1);
            }
        }
    };


    this.onResize = function() {
        this.x = windowWidth - this.size - 20; // Keep it in the top-right corner
        this.y = 20; // Adjust position slightly if needed
    };

};