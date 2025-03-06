let UploadFileConstructor = function () {
    this.handleFileSelect = function (event) {
        const files = event.target.files;
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const objectURL = URL.createObjectURL(file);
            audioFiles.push({ name: file.name, url: objectURL });
        }
        this.updateFileList();
    };

    this.updateFileList = function () { // Update the displayed list of files
        controls.playListData.popUpData = audioFiles;
        soundTrack.initPlayList();
    };

    this.uploadFile = function (callback) {
        // Attach click event **once** for dynamically created elements
        if (!document.uploadListenerAdded) {
            document.uploadListenerAdded = true; // Prevent multiple bindings

            document.addEventListener('click', (event) => {
                const uploadButton = event.target.closest('.upload-audio-file');
                if (uploadButton) {
                    console.log('Upload button clicked');

                    // Ensure we find the correct #fileInput
                    let fileInput = document.getElementById('fileInput');
                    if (!fileInput) {
                        console.error('Error: #fileInput not found!');
                        return;
                    }

                    fileInput.click();
                }
            });

            document.addEventListener('change', (event) => {
                if (event.target.id === 'fileInput') {
                    if (event.target.files.length > 0) {
                        this.handleFileSelect(event);
                        callback('success');
                        setTimeout(() => {
                            callback('uploaded');
                        }, 100);
                    }
                }
            });
        }
    };

    this.updateFileList();
};