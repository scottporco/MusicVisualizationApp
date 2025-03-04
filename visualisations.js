// Container function for the visualisations
function Visualisations() {
	// Array to store visualisations
	this.visuals = [];
	// Currently selected vis. set to null until a vis is loaded in
	this.selectedVisual = null;

	// Add a new visualisation to the array
	//@param vis: a visualisation object
	this.add = function(vis) {
		this.visuals.push(vis);
		// If selectedVisual is null, set the new visual as the current visualisation
		if (this.selectedVisual == null) {
			this.selectVisual(vis.name);
		}
	};

	// Select a visualisation using its name property
	//@param visName: name property of the visualisation
	this.selectVisual = function(visName) {
		for (let i = 0; i < this.visuals.length; i++) {
			if (this.selectedVisual && this.selectedVisual.name === "CircularWaveWeather") {
				this.selectedVisual.hideDropdown();
			}

			if (visName === this.visuals[i].name) {
				this.selectedVisual = this.visuals[i];
			}
		}
	};

	// Get an array of all visualisation names
	this.getVisualNamesArray = function() {
		return this.visuals.map(vis => vis.name);
	};
}