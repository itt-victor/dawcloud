import { grid } from '../components/generalgrid';
import { soundcontroller } from '../app_core';
import { soundStatuses } from '../app_core';
import { timeSpace } from '../timeSpace';

export function dragRecording() {
    var ctx;
    var recording;
    var drag = [false, false, false, false, false, false, false, false];
    var delta = new Object();
    var X;
    var Y;
    var widths;

    function onMousePos(canvas, evt) {
        var rect = canvas.getBoundingClientRect();
        return {
            x: Math.round(evt.clientX - rect.left),
            y: Math.round(evt.clientY - rect.top)
        };
    }

    for (var i = 0; i < grid.recordings.length; i++) {

        if (grid.recordings[i].canvas != undefined) {  //MIRATE ESTO

            grid.recordings[i].canvas.addEventListener("mousedown", function (evt) {
                recording = grid.recordings[this.id.charAt(10)];
                ctx = recording.canvasCtx;

                X = recording.timeToStart / timeSpace.zoom;
                Y = 0;
                widths = selectTrackWidth(recording.tracknumber);
                var mousePos = onMousePos(grid.canvas, evt);
                if (mousePos.y < widths.maxHeight &&
                    mousePos.y > widths.minHeight) {
                    drag[recording.tracknumber] = true;
                    delta.x = X - mousePos.x;
                    delta.y = Y - mousePos.y;
                }
            }, false);

            grid.recordings[i].canvas.addEventListener("mousemove", function a(evt) {
                recording = grid.recordings[this.id.charAt(10)];
                ctx = recording.canvasCtx;
                X = recording.timeToStart / timeSpace.zoom;
                Y = 0;
                var mousePos = onMousePos(grid.canvas, evt);
                let heights = selectTrackWidth(recording.tracknumber);
                if (drag[recording.tracknumber]) {
                    X = mousePos.x + delta.x, Y = mousePos.y
                    if (X < 0) { X = 0 };
                    if (Y < heights.minHeight || Y > heights.maxHeight) { drag[recording.tracknumber] = false; }

                    this.style.left = X + 'px';
                    recording.timeToStart = X * timeSpace.zoom;
                    if (soundStatuses.isPlaying == true && soundStatuses.hasStopped == false) {
                        soundcontroller.playWhileDragging(this.parent);
                    }
                }
            }, false);

            grid.recordings[i].canvas.addEventListener("mouseup", function (evt) {
                recording = grid.recordings[this.id.charAt(10)];
                drag[recording.tracknumber] = false;
            }, false);
        }
    }
}

function selectTrackWidth(tracknumber) {
    var incremento = 70 * tracknumber;
    let widths = {
        minHeight: (-560 + incremento),
        maxHeight: -500 + incremento,
        minWidth: 1.5,
        maxWidth: 1001.5
    }
    return widths;
}

setTimeout(dragRecording, 1250);
