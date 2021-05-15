import { ui_draw } from './ui_draw';
import { grid } from '../components/generalgrid';
import { soundcontroller } from '../app_core';
import { soundStatuses } from '../app_core';

export function dragRecording() {
    var trackCanvas;
    var ctx;
    var recordings;
    var recording;
    var drag = false;
    var delta = new Object();
    var X;
    var Y;

    function updateRecording(x, y, recording, ctx) {
        var width = recording.audioBuffer.duration * 5;                 //1000px son iguales a 200s, o 3min 20s -
        var height = 67;
        ctx.fillStyle = '#8254a7';                                      //Por lo que en cada segundo se mueven 5px.
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(width + x, 0);
        ctx.lineTo(width + x, height);
        ctx.lineTo(x, height);
        ctx.fill();
        ctx.closePath()
        ctx.strokeStyle = '#380166';
        ctx.strokeRect(x, 0, width, height);
        var data = recording.audioBuffer.getChannelData(0);
        var step = Math.ceil(data.length / width);
        var amp = height / 2;
        for (var i = 0; i < width; i+= 2) {
            var min = 1.0;
            var max = -1.0;
            for (var j = 0; j < step; j++ ) {
                var datum = data[(i * step) + j];
                if (datum < min)
                    min = datum;
                if (datum > max)
                    max = datum;
            }
            ctx.fillStyle = '#00643e';
            ctx.fillRect(i+ x, (1 + min) * amp, 1, Math.max(1, (max - min) * amp));
        }
    }

    function draggedWaveform(recording, canvasCtx, x) {
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

    function onMousePos(canvas, evt) {
        var rect = canvas.getBoundingClientRect();
        return {
            x: Math.round(evt.clientX - rect.left),
            y: Math.round(evt.clientY - rect.top)
        };
    }

    for (var i = 0; i < grid.tracks.length; i++) {
        trackCanvas = grid.tracks[i].canvas;
        ctx = grid.tracks[i].canvasCtx;
        recordings = grid.tracks[i].recordings;

        if (grid.tracks[i].recordings.length != 0) {
            recording = recordings[0];
            X = recording.timeToStart * 5;
            Y = 0;

            trackCanvas.addEventListener("mousedown", function (evt) {
                ctx = this.parent.canvasCtx;
                recording = this.parent.recordings[0];
                var mousePos = onMousePos(this, evt);
                if (ctx.isPointInPath(mousePos.x, mousePos.y)) {
                    drag = true;
                    delta.x = X - mousePos.x;
                    delta.y = Y - mousePos.y;
                }
            }, false);

            trackCanvas.addEventListener("mousemove", function (evt) {
                ctx = this.parent.canvasCtx;
                recording = this.parent.recordings[0];
                var mousePos = onMousePos(this, evt);
                if (drag) {
                    ctx.clearRect(0, 0, this.width, this.height);
                    X = mousePos.x + delta.x, Y = mousePos.y + delta.y
                    if (X < 0) { X = 0 };
                    updateRecording(X, Y, recording, ctx);
                    recording.timeToStart = X / 5;
                    if (soundStatuses.isPlaying == true && soundStatuses.hasStopped == false) {
                        soundcontroller.playWhileDragging(recording);
                    }
                }
            }, false);

            trackCanvas.addEventListener("mouseup", function (evt) {
                ctx = this.parent.canvasCtx;
                recording = this.parent.recordings[0];
                var width = recording.audioBuffer.duration * 5;
                ctx.clearRect(0, 0, this.width, this.height);
                updateRecording(X, Y, recording, ctx);
                draggedWaveform(recording, ctx, X)
                drag = false;
            }, false);
        }
    }
}

setTimeout(dragRecording, 1000);
