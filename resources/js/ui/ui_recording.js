

export default function ui_recording() {
    //var actualTime = 0;
    function drawTrack(audioBuffer, track, actualTime) {
        var x = actualTime * 1000 / 200;
        var canvasCtx = track.getContext('2d');
        track.width = 1000;
        track.height = 80;
        var width = audioBuffer.duration * 1000 / 200;
        //1000px son iguales a 200s, o 3min 20s - para cambiar el zoom puedes jugar con esto
        //Por lo que en cada segundo se mueven 5px.
        canvasCtx.fillStyle = '#380166';
        canvasCtx.fillRect(x, 0, width, 77);
        audioBuffer = null;
    }

    function drawTrackWhileRecording(actualTime) {
        var width = 0;
        //var x = actualTime * 1000 / 200;
        var x = actualTime * 5;
        var track = document.querySelector('[data-selected] > canvas');
        var canvasCtx = track.getContext('2d');
        track.width = 1000;
        track.height = 80;
        var interval = setInterval(function () {
            width++;
            canvasCtx.fillStyle = '#380166';
            canvasCtx.fillRect(x, 0, width, 77);
        }, 200)
        stop.addEventListener('click', function () {
            clearInterval(interval);
        });
    }
}
