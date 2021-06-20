import { grid } from '../components/generalgrid';
import { soundcontroller, soundStatuses } from '../app_core';
import { timeSpace } from '../timeSpace';
import { ui_draw } from './ui_draw';
import { cursor } from '../components/cursor';
import { cut } from './ui_cutRecordings';

export function editRecording(recording) {

    //arrastrar grabaciones

    var drag = false;
    var crop_left = false;
    var crop_right = false;
    var delta = new Object();
    var cropDelta = 0;
    var X = recording.timeToStart * timeSpace.zoom;
    var Y = 0;
    var offset = recording.offset * timeSpace.zoom;
    var duration = recording.duration * timeSpace.zoom;
    var sizes;

    function onMousePos(canvas, evt) {
        var rect = canvas.getBoundingClientRect();
        return {
            x: Math.round(evt.clientX - rect.left),
            y: Math.round(evt.clientY - rect.top)
        };
    }

    recording.canvas.addEventListener("mousedown", function (evt) {
        X = recording.timeToStart * timeSpace.zoom;
        sizes = selectTrackWidth(recording.tracknumber);
        let mousePos = onMousePos(grid.canvas, evt);
        if (mousePos.y < sizes.maxHeight &&
            mousePos.y > sizes.minHeight) {
            drag = true;
            delta.x = X - mousePos.x;
            delta.y = Y - mousePos.y;
        }
    }, false);

    window.addEventListener("mousemove", function a(evt) {
        X = recording.timeToStart * timeSpace.zoom;
        let mousePos = onMousePos(grid.canvas, evt);
        sizes = selectTrackWidth(recording.tracknumber);
        if (drag) {
            X = mousePos.x + delta.x, Y = mousePos.y + delta.y;
            if (X + offset < 0) { X = 0 - offset };
            recording.canvas.style.left = X + 'px';
            recording.timeToStart = X / timeSpace.zoom;
            if (soundStatuses.isPlaying == true && soundStatuses.hasStopped == false) {
                soundcontroller.playWhileDragging(recording);
            }
            if (mousePos.y > sizes.maxHeight || mousePos.y < sizes.minHeight) {
                let newTrack;
                for (let i = 0; i < grid.tracks.length; i++) {
                    sizes = selectTrackWidth(grid.tracks[i].tracknumber)
                    if (mousePos.y > sizes.minHeight && mousePos.y < sizes.maxHeight) {
                        newTrack = grid.tracks[i];
                        newTrack.trackDOMElement.appendChild(recording.canvas);
                        recording.tracknumber = newTrack.tracknumber;
                    }
                }
            }
        }
    }, false);

    window.addEventListener("mouseup", function (evt) {

        drag = false;
        if (crop_left) {
            recording.offset = offset / timeSpace.zoom;
            crop_left = false;
        }

        if (crop_right) {
            recording.duration = duration / timeSpace.zoom;
            crop_right = false;
        }
    }, false);

    //Recortar bordes de grabaciones

    recording.canvas.addEventListener("mousedown", function (evt) {

        let mousePos = onMousePos(this, evt);
        offset = recording.offset * timeSpace.zoom;
        duration = recording.duration * timeSpace.zoom;

        if (mousePos.x < offset + 3 && mousePos.x > offset - 2) {
            cropDelta = offset - mousePos.x;
            crop_left = true;
            drag = false;
        } else if (mousePos.x < duration + 3 && mousePos.x > duration - 3) {
            cropDelta = duration - mousePos.x;
            crop_right = true;
            drag = false;
        }
    });

    recording.canvas.addEventListener("mousemove", function (evt) {

        let mousePos = onMousePos(this, evt);
        offset = recording.offset * timeSpace.zoom;
        duration = recording.duration * timeSpace.zoom;
        let offCanvas;
        if (this.selected) {
            offCanvas = recording.offSelectedCanvas[timeSpace.zoom];
        } else {
            offCanvas = recording.offCanvas[timeSpace.zoom];
        }

        if (cut) {
            this.style.cursor = 'col-resize';
        }
        else if (mousePos.x < offset + 3 && mousePos.x > offset - 2) {
            this.style.cursor = 'w-resize';
        }
        else if (mousePos.x < duration + 3 && mousePos.x > duration - 3) {
            this.style.cursor = 'w-resize';
        } else {
            this.style.cursor = 'default';
        }

        if (crop_left) {
            offset = Math.max(mousePos.x + cropDelta, 0);
            ui_draw.printRecording(recording, offCanvas, offset, duration);
            this.style.cursor = 'w-resize';
            if (soundStatuses.isPlaying == true && soundStatuses.hasStopped == false
                && parseFloat(cursor.canvas.style.left) < offset + parseFloat(this.style.left)) {
                recording.offset = offset / timeSpace.zoom;
                soundcontroller.playWhileDragging(recording);
            }
        }
        if (crop_right) {
            duration = Math.max(mousePos.x + cropDelta, 0);
            ui_draw.printRecording(recording, offCanvas, offset, duration);
            this.style.cursor = 'w-resize';
            if (soundStatuses.isPlaying == true && soundStatuses.hasStopped == false
                && parseFloat(cursor.canvas.style.left) < duration + parseFloat(this.style.left)) {
                recording.duration = duration / timeSpace.zoom;
                soundcontroller.playWhileDragging(recording);
            }
        }
    });

}

function selectTrackWidth(tracknumber) {
    var incremento = 60 * tracknumber;
    let widths = {
        minHeight: incremento,
        maxHeight: incremento + 60,
        minWidth: 0.5,
        maxWidth: 1001.5
    }
    return widths;
}
