import { stop } from '../app_core';
import { timeSpace } from '../timeSpace';

export var ui_draw = {
    drawTrackWhileRecording() {
        let width = 0;
        let height = 67;
        let x = timeSpace.space;
        let track = document.querySelector('[data-selected]');
        var canvas = document.createElement('canvas')
        track.appendChild(canvas)
        let canvasCtx = canvas.getContext('2d');
        canvas.width = 10000;
        canvas.height = 70;
        canvasCtx.fillStyle = '#2ed9a5';
        let start = performance.now();
        let increase = 0;
        let progress;
        let fps;
        let interval;
        function step(now) {
            progress = now - start;
            fps = Math.round(1000 / (progress / ++increase) * 100) / 100;
            width += timeSpace.zoom * 1 / fps;
            canvasCtx.fillRect(x, 0, width, height);
            interval = requestAnimationFrame(step);
        }
        interval = requestAnimationFrame(step);
        stop.addEventListener('click', function () {
            window.cancelAnimationFrame(interval);
            canvas.remove();
        });
    },

    drawRecording(recording) {
        var canvas = recording.canvas;
        canvas.setAttribute("class", "recording");
        canvas.id = recording.id;
        var x = recording.timeToStart * timeSpace.zoom;
        var width = recording.audioBuffer.duration * (timeSpace.zoom + 0.11); //Ese 0.11 corrige descompensación
        var height = 67;
        canvas.style.left = x + 'px';
        canvas.width = width;
        canvas.height = height;
        var canvasCtx = canvas.getContext('2d');
        canvasCtx.clearRect(0, 0, width, height);
        canvasCtx.fillStyle = '#2ed9a5';
        canvasCtx.beginPath();
        canvasCtx.moveTo(0, 0);
        canvasCtx.lineTo(width, 0);
        canvasCtx.lineTo(width, 67);
        canvasCtx.lineTo(0, 67);
        canvasCtx.fill();
        canvasCtx.closePath()
        canvasCtx.strokeStyle = '#380166';
        canvasCtx.strokeRect(0, 0, width, height);

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
                canvasCtx.fillStyle = '#20453a';
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
                canvasCtx.fillStyle = '#20453a';
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
                canvasCtx.fillStyle = '#20453a';
                canvasCtx.fillRect(i, (1 + min) * amp, 1, Math.max(1, (max - min) * amp));
            }
        }
    },

    clickAtRecording(recording) {
        var canvas = recording.canvas;
        var canvasCtx = canvas.getContext('2d');
        var x = recording.timeToStart * timeSpace.zoom;
        var width = recording.audioBuffer.duration * (timeSpace.zoom + 0.11);
        var height = 67;
        canvas.style.left = x + 'px';
        canvas.width = width;
        canvas.height = height;
        canvasCtx.clearRect(0, 0, width, height);
        canvasCtx.fillStyle = '#20453a';
        canvasCtx.beginPath();
        canvasCtx.moveTo(0, 0);
        canvasCtx.lineTo(width, 0);
        canvasCtx.lineTo(width, 67);
        canvasCtx.lineTo(0, 67);
        canvasCtx.fill();
        canvasCtx.closePath();
        canvasCtx.strokeStyle = '#380166';
        canvasCtx.strokeRect(0, 0, width, height);

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
                canvasCtx.fillStyle = '#2ed9a5';
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
                canvasCtx.fillStyle = '#2ed9a5';
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
                canvasCtx.fillStyle = '#2ed9a5';
                canvasCtx.fillRect(i, (1 + min) * amp, 1, Math.max(1, (max - min) * amp));
            }
        }
    },

    drawWhileCropping(canvas, X) {
        let height = 67;
        let canvasCtx = canvas.getContext('2d');
        canvasCtx.fillStyle = '#2ed9a5';
        canvasCtx.clearRect(0, 0, X, height)
        //canvasCtx.fillRect(0, 0, X, height);
    }
}
