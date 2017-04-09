navigator.getUserMedia = navigator.getUserMedia ||
    navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia;

window.addEventListener("load", function (evt) {
    const ws = new WebSocket('ws://localhost:7777');
    ws.binaryType = 'arraybuffer';

    ws.onopen = function (event) {
        console.log('--- connected', event);
    }

    const id = setInterval(() => {
        if (ws.readyState === 1) {
            clearInterval(id);
            navigator.getUserMedia({ audio: true, video: true }, onMediaSuccess, onMediaError);
        }
    }, 100);

    function onMediaSuccess(stream) {
        const mediaRecorder = new MediaRecorder(stream);

        mediaRecorder.mimeType = 'video/webm; codecs="vorbis,vp8"';

        mediaRecorder.ondataavailable = (event) => {
            var fr = new FileReader();
            fr.onload = function (e) {
                console.log(new Uint8Array(e.target.result)[0]);
                ws.send(e.target.result);
            };
            fr.readAsArrayBuffer(event.data)
            
        };

        mediaRecorder.start(3000);

        const video = document.getElementById('localVideo');
        video.src = window.URL.createObjectURL(stream);
    }

    function onMediaError(e) {
        console.error('media error', e);
    }
});