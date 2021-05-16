import { stop } from '../app_core';

export var ui_draw = {
    drawTrackWhileRecording(actualTime) {
        var width = 0;
        var x = actualTime * 5;
        var track = document.querySelector('[data-selected]');
        var canvas = document.createElement('canvas')
        track.appendChild(canvas)
        var canvasCtx = canvas.getContext('2d');
        canvas.width = 1000;
        canvas.height = 70;
        var interval = setInterval(function () {
            width++;
            canvasCtx.fillStyle = '#380166';
            canvasCtx.fillRect(x, 0, width, 70);
        }, 200)
        stop.addEventListener('click', function () {
            clearInterval(interval);
            canvas.remove();
        });
    },

    drawRecording(recording) {
        var canvas = recording.canvas;
        canvas.setAttribute("class", "recording");
        var x = recording.timeToStart * 5;
        var width = recording.audioBuffer.duration * 5;
        var height = 67;
        canvas.style.left = x + 'px';
        canvas.width = width;
        canvas.height = height;
        var canvasCtx = canvas.getContext('2d');
        canvasCtx.fillStyle = '#8254a7';
        canvasCtx.beginPath();
        canvasCtx.moveTo(0, 0);
        canvasCtx.lineTo(width, 0);
        canvasCtx.lineTo(width, 67);
        canvasCtx.lineTo(0, 67);
        canvasCtx.fill();
        canvasCtx.closePath()
        canvasCtx.strokeStyle = '#380166';
        canvasCtx.strokeRect(0, 0, width, 67);

        if (recording.audioBuffer.numberOfChannels === 2) {  //si es estereo..
            var data = recording.audioBuffer.getChannelData(0);
            var step = Math.ceil(data.length / width);
            var amp = height / 4;
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
                canvasCtx.fillRect(i, (1 + min) * amp, 1, Math.max(1, (max - min) * amp));
            }
            var data = recording.audioBuffer.getChannelData(1);
            var step = Math.ceil(data.length / width);
            var amp = height / 4;
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
                canvasCtx.fillRect(i, (1 + min) * amp + height / 2, 1, Math.max(1, (max - min) * amp));
            }
        } else if (recording.audioBuffer.numberOfChannels === 1) {  // si es mono..
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
                canvasCtx.fillRect(i, (1 + min) * amp, 1, Math.max(1, (max - min) * amp));
            }
        }
    }
}
