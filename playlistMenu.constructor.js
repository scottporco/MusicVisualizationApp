let PlaylistMenuConstructor = function () {

    this.draw = function () {
        document.querySelector('.play-list-popup section ol').innerHTML =
            audioFiles.map(
                item => `
                  <li data-blob="${item.url}" class="section-body-list ${controls.playListData.menuType}-item">
                    <div>
                         <span class="track-title">
                            ${item.name}
                        </span>
                        <span class="remove-track material-symbols-outlined">
                            cancel
                        </span>
                    </div>
                  </li>
                `)
                .join('');

        soundTrack.trackEventListeners();

        this.removeItem(()=>{
            this.draw();
        });
    }


    this.removeItem = function (callback) {
        if ( document.querySelector(`.remove-track`)){
            document.querySelectorAll(`.remove-track`).forEach((item, index) => {
                item.addEventListener('click', () => { // CLICK TO REMOVE
                    delete audioFiles[index]
                    if (typeof callback === 'function') { // IF A DEVELOPER NEEDS A BOOLEAN CALLBACK
                        callback();
                    }
                });
            });
        }

        soundTrack.trackEventListeners();
    }



}