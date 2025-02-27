let UploadFileConstructor = function () {


    // Handle file selection
    this.handleFileSelect = function (event) {
        const files = event.target.files;
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const objectURL = URL.createObjectURL(file);
            audioFiles.push({ name: file.name, url: objectURL });
        }

        this.updateFileList();
    }

    this.updateFileList = function () {     // Update the displayed list of files
        controls.playListData.popUpData = audioFiles;
        soundTrack.initPlayList();
    }


    this.uploadFile = function (callback) {
        let uploadButton = document.querySelectorAll('.upload-audio-file')[0]; // Get first element

        if (uploadButton) {
            uploadButton.addEventListener('click', () => {
                document.getElementById('fileInput').click();
            });

            document.getElementById('fileInput').addEventListener('change',  (event)=> {
                if (event.target.files.length > 0) {
                    this.handleFileSelect(event);
                    callback('success');
                    setTimeout(() => {
                        callback('uploaded');
                    }, 100);
                }
            });
        } else {
            callback('fail');
            return false;
        }
    };

    this.updateFileList();

};
