// MY CODE HERE
function PopUpConstructor(data, className) {

    this.data = data
    this.isOpen = false;
    this.className = className;

    this.toggle = function (callback) {
        console.log(this.className);
        this.isOpen = !this.isOpen;
        document.querySelector(`.${this.className}`).classList.toggle('hidden');

        if (typeof callback === 'function') { // IF A DEV NEEDS A BOOLEAN CALLBACK
            callback(this.isOpen);
        }
    };



     this.generateSectionBody = function(items) {
        // RESEARCHING MAP IN THE JAVASCRIPT WORLD
        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map
        if(data.menuType === "playlist"){
            console.log('items playlist', items)

        }
        else
        {
            return items.map(item =>
                `<li class="section-body-list ${data.menuType}-item">
                    <span>
                        ${item}
                    </span>
                </li>`)
                .join('');
        }
    }

    this.initialisePopUp = function () {
        return `<aside class="popup-modal hidden ${this.className} ">
				   <nav>
				        <header>
				            <h2>${data.title}</h2>
				            <button class="upload-audio-file ${data.addBtn === false ? 'hidden' : 'block'}">
				            <input type="file" id="fileInput" style="display: none;">
                                <span class="material-symbols-outlined white">
                                    add_box
                                </span>
                            </button>
				        </header>
                       <section>
                            <ol>
                                ${this.generateSectionBody(data.popUpData)}
                            </ol>
                        </section>
                          

                   </nav>
                </aside>`;
        if (this.isOpen) {
        } else return false
    }

}
// END MY CODE HERE