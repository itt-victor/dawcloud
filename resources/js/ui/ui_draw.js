import { stop } from '../app_core';
import { timeSpace } from '../timeSpace';
import { chunks } from '../audio/recordcontroller';

export var ui_draw = {
    drawTrackWhileRecording() {
        let width = 0;
        let height = 58;
        let x = timeSpace.space;
        let track = document.querySelector('[data-selected]');
        var canvas = document.createElement('canvas')
        track.appendChild(canvas)
        let canvasCtx = canvas.getContext('2d');
        canvas.width = 10000;
        canvas.height = 60;
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
        document.addEventListener('keypress', function (e) {
            if (e.key === ' ') {
                if (e.target == project_name) { return; }
                window.cancelAnimationFrame(interval);
                canvas.remove();
            }
        });

    },

    drawRecording(recording, zoom) {
        let offCanvas = document.createElement('canvas');
        let width = recording.audioBuffer.duration * (zoom + 0.15); //Ese 0.11 corrige descompensación
        let height = 58;
        offCanvas.width = width;
        offCanvas.height = height;
        let canvasCtx = offCanvas.getContext('2d');
        canvasCtx.fillStyle = '#2ed9a5';
        canvasCtx.beginPath();
        canvasCtx.moveTo(0, 0);
        canvasCtx.lineTo(width, 0);
        canvasCtx.lineTo(width, 58);
        canvasCtx.lineTo(0, 58);
        canvasCtx.fill();
        canvasCtx.closePath()
        canvasCtx.strokeStyle = '#380166';
        canvasCtx.strokeRect(0, 0, width, height);
        canvasCtx.fillStyle = '#20453a';

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
                canvasCtx.fillRect(i, (1 + min) * amp, 1, Math.max(1, (max - min) * amp));
            }
        }
        return offCanvas;
    },

    selectedRecording(recording, zoom) {
        let offCanvas = document.createElement('canvas');
        let width = recording.audioBuffer.duration * (zoom + 0.15);
        let height = 58;
        offCanvas.width = width;
        offCanvas.height = height;
        let canvasCtx = offCanvas.getContext('2d');
        canvasCtx.fillStyle = '#20453a';
        canvasCtx.beginPath();
        canvasCtx.moveTo(0, 0);
        canvasCtx.lineTo(width, 0);
        canvasCtx.lineTo(width, 58);
        canvasCtx.lineTo(0, 58);
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
        return offCanvas;
    },

    printRecording(recording, offCanvas, offset, duration) {
        let width = recording.audioBuffer.duration * (timeSpace.zoom + 0.13);
        let height = 58;
        let x = recording.timeToStart * timeSpace.zoom;
        recording.canvas.width = width;
        recording.canvas.height = height;
        recording.canvasCtx.clearRect(0, 0, width, height);
        recording.canvasCtx.drawImage(offCanvas, 0, 0);
        recording.canvas.style.left = x + 'px';
        recording.canvasCtx.clearRect(0, 0, offset, height);
        recording.canvasCtx.clearRect(duration, 0, width - duration, height);
        //recording.canvasCtx.drawImage(offCanvas, offset, 0, duration, height, 0, 0, duration, height);
    }
}
