import { stop } from '../app_core';
//export * from '../app_core';



export var ui_draw = {
    drawTrackWhileRecording(actualTime) {
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
    },
    drawRecording(recording, canvasCtx) {
        var x = recording.timeToStart * 5;
        //var canvasCtx = canvasCtx;
        var width = recording.audioBuffer.duration * 5;                 //1000px son iguales a 200s, o 3min 20s -
        canvasCtx.fillStyle = '#8254a7';                      //para cambiar el zoom puedes jugar con esto
        canvasCtx.fillRect(x, 0, width, 77);                  //Por lo que en cada segundo se mueven 5px.
        canvasCtx.strokeStyle = '#380166';
        canvasCtx.strokeRect(x, 0, width, 77);
    }
}
