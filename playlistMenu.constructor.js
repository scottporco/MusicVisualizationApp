let PlaylistMenuConstructor = function () {


    this.draw = function () {
        document.querySelector('.play-list-popup section ol').innerHTML =
            uploadSoundFile.audioFiles.map(item => `
                  <li data-blob="${item.url}" class="section-body-list ${controls.playListData.menuType}-item">
                    <span>
                        ${item.name}
                    </span>
                  </li>`)
            .join('');
    }


    this.removeItem = function (index) {

        delete uploadSoundFile.audioFiles[index]

    }


}