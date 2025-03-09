let QuoteVisualization = function() {
    this.name = "QuoteVisualization";

    let quote = "Loading quote...";
    let author = "";
    let lastUpdated = 0;
    let fadeAlpha = 0;
    let fadeIn = true;
    let fft = new p5.FFT();
    let bgColor1, bgColor2;

    this.getQuote = async function() {
        try {
            let response = await fetch("https://api.api-ninjas.com/v1/quotes", {
                headers: { "X-Api-Key": "xKbWnwmHNV9IHDeo0UEQwg==yaTulIjAZgWvBycA" }
            });
            if (response.ok) {
                let data = await response.json();
                if (data.length > 0) {
                    quote = data[0].quote; // Corrected property name
                    author = data[0].author;
                }
                fadeAlpha = 0; // Reset fade effect
                fadeIn = true;
                randomizeColors();
            }
        } catch (error) {
            console.error("Failed to fetch quote", error);
            quote = "The only limit to our realization of tomorrow is our doubts of today.";
            author = "Franklin D. Roosevelt";
        }
    };

    function randomizeColors() {
        bgColor1 = color(random(50, 255), random(50, 255), random(50, 255));
        bgColor2 = color(random(50, 255), random(50, 255), random(50, 255));
    }

    this.draw = function() {
        // More drastic background color shifting
        for (let i = 0; i < height; i++) {
            let inter = map(i, 0, height, 0, 1);
            let c = lerpColor(bgColor1, bgColor2, inter);
            stroke(c);
            line(0, i, width, i);
        }

        // Background pulse
        let spectrum = fft.analyze();
        let bass = spectrum[2];
        let bgPulse = map(bass, 0, 255, 50, 200);
        background(bgPulse, 20, 60, 50, 50);

        push();
            fill(255, fadeAlpha);
            textAlign(CENTER, CENTER);
            textSize(32);
            let textBoxWidth = width * 0.6;
            let textBoxHeight = height * 0.3;
            text(quote, width / 2 - textBoxWidth / 2, height / 2 - textBoxHeight / 2, textBoxWidth, textBoxHeight);
            textSize(24);
            text(`- ${author}`, width / 2, height / 2 + textBoxHeight / 2 + 30);
        pop(); // Restore previous drawing state

        // Smooth fade-in effect
        if (fadeIn) {
            fadeAlpha += 5;
            if (fadeAlpha >= 255) fadeIn = false;
        }

        // Update quote every 30 seconds
        if (millis() - lastUpdated > 30000) {
            lastUpdated = millis();
            this.getQuote();
        }

        // Funky sound wave visualization (more dynamic)
        push(); // Isolate transformations
        let spectrumWave = fft.analyze();
        noFill();
        strokeWeight(4);
        beginShape();
        for (let i = 0; i < spectrumWave.length; i += 10) {
            let x = map(i, 0, spectrumWave.length, 0, width);
            let y = map(spectrumWave[i], 0, 255, height, 0);
            stroke(random(255), random(255), random(255));
            vertex(x, y);
        }
        endShape();
        pop(); // Restore previous drawing state
    };

    // Fetch the first quote on load
    this.getQuote();
    randomizeColors();
};
