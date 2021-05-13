import { stop } from '../app_core';
//export * from '../app_core';

export var ui_recording = {
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
    }
}
