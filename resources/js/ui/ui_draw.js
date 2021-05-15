import { stop } from '../app_core';
import { audioCtx } from '../audio/soundcontroller';

export var ui_draw = {
    drawTrackWhileRecording(actualTime) {
        var width = 0;
        //var x = actualTime * 1000 / 200;
        var x = actualTime * 5;
        var track = document.querySelector('[data-selected] > canvas');
        var canvasCtx = track.getContext('2d');
        track.width = 1000;
        track.height = 70;
        var interval = setInterval(function () {
            width++;
            canvasCtx.fillStyle = '#380166';
            canvasCtx.fillRect(x, 0, width, 70);
        }, 200)
        stop.addEventListener('click', function () {
            clearInterval(interval);
        });
    },
    drawRecording(recording, canvasCtx) {
        var x = recording.timeToStart * 5;
        var width = recording.audioBuffer.duration * 5;                 //1000px son iguales a 200s, o 3min 20s -
        canvasCtx.fillStyle = '#8254a7';                               //Por lo que en cada segundo se mueven 5px.
        canvasCtx.beginPath();
        canvasCtx.moveTo(x, 0);
        canvasCtx.lineTo(width + x, 0);
        canvasCtx.lineTo(width + x, 67);
        canvasCtx.lineTo(x, 67);
        canvasCtx.fill();
        canvasCtx.closePath()
        canvasCtx.strokeStyle = '#380166';
        canvasCtx.strokeRect(x, 0, width, 67);
    },

    drawWaveform(recording, canvasCtx) {
        var x = recording.timeToStart * 5;
        var height = 67;
        var width = recording.audioBuffer.duration * 5;
        var data = recording.audioBuffer.getChannelData(0);
        var step = Math.ceil(data.length / width);
        var amp = height / 2;
        for (var i = 0; i < width; i++) {
            var min = 1.0;
            var max = -1.0;
            for (var j = 0; j < step; j++) {
                var datum = data[(i * step) + j];
                if (datum < min)
                    min = datum;
                if (datum > max)
                    max = datum;
            }
            canvasCtx.fillStyle = '#022100';
            canvasCtx.fillRect(i +x, (1 + min) * amp, 1, Math.max(1, (max - min) * amp));
        }
    }
}
