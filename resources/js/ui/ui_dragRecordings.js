import { grid } from '../components/generalgrid';
import { soundcontroller } from '../app_core';
import { soundStatuses } from '../app_core';
import { timeSpace } from '../timeSpace';

export function dragRecording(recording) {
    var drag = false;
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

    if (recording.canvas) {

        recording.canvas.addEventListener("mousedown", function (evt) {

            X = recording.timeToStart / timeSpace.zoom;
            Y = 0;
            widths = selectTrackWidth(recording.tracknumber);
            var mousePos = onMousePos(grid.canvas, evt);
            if (mousePos.y < widths.maxHeight &&
                mousePos.y > widths.minHeight) {
                drag = true;
                delta.x = X - mousePos.x;
                delta.y = Y - mousePos.y;
            }
        }, false);

        recording.canvas.addEventListener("mousemove", function a(evt) {

            X = recording.timeToStart / timeSpace.zoom;
            Y = 0;
            var mousePos = onMousePos(grid.canvas, evt);
            let heights = selectTrackWidth(recording.tracknumber);
            if (drag) {
                X = mousePos.x + delta.x, Y = mousePos.y
                if (X < 0) { X = 0 };
                if (Y < heights.minHeight || Y > heights.maxHeight) { drag = false; }

                this.style.left = X + 'px';
                recording.timeToStart = X * timeSpace.zoom;
                if (soundStatuses.isPlaying == true && soundStatuses.hasStopped == false) {
                    soundcontroller.playWhileDragging(recording);
                }
            }
        }, false);

        recording.canvas.addEventListener("mouseup", function (evt) {
            drag = false;
        }, false);
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
