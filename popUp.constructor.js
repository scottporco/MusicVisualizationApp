// MY CODE HERE
function PopUpConstructor(data) {

    this.isOpen = false;
    this.sectionBody = generateSectionBody(data.popUpData);

    this.toggle = function (callback) {
        this.isOpen = !this.isOpen;
        // CALLBACK FOR CHANGING THE VALUE OF this.isOpen
        // then call our this.initialisePopUp function;
        callback(this.isOpen);
    };
    console.log(data.popUpData);

    function generateSectionBody(items) {
        // RESEARCHING MAP IN THE JAVASCRIPT WORLD
        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map
        return items.map(item => `<li class="section-body-list ${data.menuType}-item">${item}</li>`).join('');
    }

    this.initialisePopUp = function (classname) {
        return `<aside class="popup-modal ${classname}">
				   <nav>
				        <header>
				            <h2>${data.title}</h2>
				            <button class="${ data.addBtn === false ? 'hidden' : 'block'}">
                                <span class="material-symbols-outlined white">
                                    add_box
                                </span>
                            </button>
				        </header>
                       <section>
                            <ol>
                                ${this.sectionBody}
                            </ol>
                        </section>
                          

                   </nav>
                </aside>`;
        if (this.isOpen) {
        } else return false
    }

}
// END MY CODE HERE