// MY CODE HERE
function PopUpConstructor(dataList) {

    this.isOpen = false;

    this.click = function (callback) {
        this.isOpen = !this.isOpen;
        // CALLBACK FOR CHANGING THE VALUE OF this.isOpen
        // then call our this.initialisePopUp function;
        callback(this.isOpen);
    };

    this.initialisePopUp = function (classname) {
        if (this.isOpen) {
            return `<aside class="popup-modal ${classname}">
				   <nav>
				        
                   </nav>
                </aside>`;
        } else return false
    }

}
// END MY CODE HERE