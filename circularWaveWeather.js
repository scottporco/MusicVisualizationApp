let CircularWaveWeather = function() {
    this.name = "CircularWaveWeather";

    let fourier = new p5.FFT();
    let weatherData = null;
    let cityName = "Unknown Location";
    let lat = 51.5074; // Default to London, UK
    let lon = -0.1278; // Default to London, UK
    let weatherLoaded = false;
    let cityTimeOffset = 0; // Time zone offset in hours

    let cities = [
        { name: "Current Location", lat: null, lon: null },
        { name: "Los Angeles, USA", lat: 34.0522, lon: -118.2437 },
        { name: "New York, USA", lat: 40.7128, lon: -74.0060 },
        { name: "London, UK", lat: 51.5074, lon: -0.1278 },
        { name: "Tokyo, Japan", lat: 35.6895, lon: 139.6917 },
        { name: "Sydney, Australia", lat: -33.8688, lon: 151.2093 },
        { name: "Cape Town, South Africa", lat: -33.9249, lon: 18.4241 },
        { name: "Moscow, Russia", lat: 55.7558, lon: 37.6173 },
        { name: "São Paulo, Brazil", lat: -23.5505, lon: -46.6333 },
        { name: "Dubai, UAE", lat: 25.276987, lon: 55.296249 }
    ];

    let dropdown;

    this.createDropdown = function() {
        if (!dropdown) {
            dropdown = createSelect();
            dropdown.position(20, 20);
            dropdown.hide(); // Ensure it's hidden on initial load

            cities.forEach((city, index) => {
                dropdown.option(city.name, index);
            });

            dropdown.changed(() => {
                let selectedIndex = dropdown.value();
                let selectedCity = cities[selectedIndex];

                if (selectedCity.lat !== null && selectedCity.lon !== null) {
                    lat = selectedCity.lat;
                    lon = selectedCity.lon;
                    cityName = selectedCity.name;
                    fetchWeather();
                    fetchTimeZone();
                } else {
                    this.getWeather();
                }
            });
        }
    };

    this.hideDropdown = function() {
        if (dropdown) {
            dropdown.hide();
        }
    };

    this.showDropdown = function() {
        if (dropdown) {
            dropdown.show();
        }
    };

    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function
    // ASYNC functions interesting concept I learned about when reaserching how to consume an API with JS
    async function fetchTimeZone() {
        let url = `https://api.timezonedb.com/v2.1/get-time-zone?key=G7AGHLTK9RXG&format=json&by=position&lat=${lat}&lng=${lon}`;
        try {
            let response = await fetch(url);
            if (response.ok) {
                let data = await response.json();
                cityTimeOffset = data.gmtOffset / 3600; // Convert seconds to hours
            }
        } catch (error) {
            console.error("Time zone fetch failed", error);
        }
    }

    this.getBackgroundColor = function() {
        let now = new Date();
        let cityHour = now.getUTCHours() + cityTimeOffset;
        if (cityHour < 0) cityHour += 24;
        if (cityHour >= 5 && cityHour < 8) return color(255, 150, 100); // Dawn
        if (cityHour >= 8 && cityHour < 17) return color(135, 206, 250); // Day
        if (cityHour >= 17 && cityHour < 20) return color(255, 100, 100); // Dusk
        return color(20, 20, 60); // Night
    }

    this.getWeather = async function() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(async (position) => {
                lat = position.coords.latitude;
                lon = position.coords.longitude;

                await fetchCityName();
                await fetchWeather();
                await fetchTimeZone();
            }, async (error) => {
                console.error("Geolocation error:", error);
                await fetchCityName();
                await fetchWeather();
                await fetchTimeZone();
            });
        } else {
            console.error("Geolocation is not supported by this browser.");
            await fetchCityName();
            await fetchWeather();
            await fetchTimeZone();
        }
    };

    async function fetchCityName() {
        let url = `https://geocode.maps.co/reverse?lat=${lat}&lon=${lon}`;
        try {
            let response = await fetch(url);
            if (response.ok) {
                let data = await response.json();

                // The JavaScript technique used here is called short-circuit evaluation with the logical OR (||)
                // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Logical_OR
                cityName = data.address.city || data.address.town || data.address.village || "Unknown Location";

            }
        } catch (error) {
            console.error("City name fetch failed", error);
        }
    }

    async function fetchWeather() {
        let url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&temperature_unit=celsius&wind_speed_unit=kmh&timezone=auto`;
        let response = await fetch(url);
        if (response.ok) {
            let data = await response.json();
            weatherData = data.current_weather;
            weatherLoaded = true;
        } else {
            console.error("Weather API fetch failed");
        }
    }

    this.draw = function() {

        this.showDropdown(); // Ensure the dropdown is visible when drawing this visualization


        background(this.getBackgroundColor());

        push();
        translate(windowWidth / 2, (windowHeight - 80) / 2);
        noFill();
        stroke(255);
        strokeWeight(3);

        let wave = fourier.waveform();
        let radius = weatherData ? map(weatherData.temperature, -10, 40, 80, 200) : 120;

        beginShape();
        for (let i = 0; i < wave.length; i++) {
            let angle = map(i, 0, wave.length, 0, TWO_PI);
            let xOffset = cos(angle) * (radius + wave[i] * 60);
            let yOffset = sin(angle) * (radius + wave[i] * 60);
            vertex(xOffset, yOffset);
        }
        endShape(CLOSE);
        pop();

        push();
        noStroke();
        fill(255);
        textAlign(CENTER, CENTER);
        textSize(24);
        text(`${cityName}`, windowWidth / 2, (windowHeight - 80) / 2 - 40);
        textSize(32);
        text(`${weatherData?.temperature ?? "--"}°C`, windowWidth / 2, (windowHeight - 80) / 2);
        textSize(20);
        text(`Wind: ${weatherData?.windspeed ?? "--"} km/h`, windowWidth / 2, (windowHeight - 80) / 2 + 40);
        pop();

    };

    this.createDropdown();
    this.getWeather();
};
