window.addEventListener("load", function (evt) {
    const ws = new WebSocket('ws://localhost:7777');
    const video = document.getElementById('localVideo');

    ws.onopen = function (event) {
        console.log('--- connected', event);
    }

    ws.onmessage = (message) => {
        console.log('--- message', message);

        var arrayBuffer;
        var fileReader = new FileReader();
        fileReader.onload = function() {
            arrayBuffer = this.result;
            try {
                window.sourceBuffer.appendBuffer(arrayBuffer);    
            } catch (error) {
                console.log('--- error', error);
                
            }
            
        };
        fileReader.readAsArrayBuffer(message.data);
    }

    const id = setInterval(() => {
        if (ws.readyState === 1) {
            clearInterval(id);
            activate();
        }
    }, 100);

    function activate() {
        debugger;
        const mediaSource = new MediaSource();
        
        
        video.src = URL.createObjectURL(mediaSource);
        mediaSource.addEventListener('sourceopen', sourceOpen);
    }

    function sourceOpen() {
        window.mediaSource = this;
        window.sourceBuffer = window.mediaSource.addSourceBuffer('video/webm;codecs=vp8');
        window.sourceBuffer.addEventListener('updateend', function (_) {
            // mediaSource.endOfStream();
            debugger;
            video.play();
            //console.log(mediaSource.readyState); // ended
        });
    }

    
});