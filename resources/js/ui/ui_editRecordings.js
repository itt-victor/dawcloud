import { grid } from '../components/generalgrid';
import { soundcontroller, is } from '../app_core';
import { timeSpace } from '../timeSpace';
import { ui_draw } from './ui_draw';
import { cursor } from '../components/cursor';
import { cut } from './ui_cutRecordings';
import { snap } from './ui_snapToGrid';


export function editRecording(recording) {

    //arrastrar grabaciones

    var drag = false,
        crop_left = false,
        crop_right = false,
        delta = new Object(),
        X = recording.timeToStart * timeSpace.zoom,
        Y = 0,
        offset = recording.offset * timeSpace.zoom,
        duration = recording.duration * timeSpace.zoom,
        bar,
        sizes,
        offCanvas,
        width;

    function onMousePos(canvas, evt) {
        var rect = canvas.getBoundingClientRect();
        return {
            x: Math.round(evt.clientX - rect.left),
            y: Math.round(evt.clientY - rect.top)
        };
    }

    recording.canvas.addEventListener("mousedown", evt => {
        X = (recording.timeToStart + recording.offset) * timeSpace.zoom;
        sizes = selectTrackHeight(recording.tracknumber);
        let mousePos = onMousePos(grid.canvas, evt);
        if (mousePos.y < sizes.maxHeight &&
            mousePos.y > sizes.minHeight) {
            drag = true;
            delta.x = X - mousePos.x;
            delta.y = Y - mousePos.y;
        }
        if (snap.toggle) {
            snap.setup = timeSpace.zoom * timeSpace.compas * timeSpace.bpm * timeSpace.snap;
            bar = Math.ceil(X / snap.setup);
        }
    }, false);

    window.addEventListener("mousemove", evt => {
        X = (recording.timeToStart + recording.offset) * timeSpace.zoom;

        let mousePos = onMousePos(grid.canvas, evt);
        sizes = selectTrackHeight(recording.tracknumber);
        if (drag) {
            X = mousePos.x + delta.x, Y = mousePos.y + delta.y;
            if (X < 0) X = 0;

            //snap al grid
            if (snap.toggle) {
                let barCount = Math.ceil(X / snap.setup);
                let left = parseFloat(recording.canvas.style.left);

                if (barCount > bar) {
                    recording.canvas.style.left =  left + snap.setup + 'px';
                    recording.timeToStart = ((X + snap.setup) / timeSpace.zoom) - recording.offset;
                    bar++;
                }
                if (barCount < bar) {
                    recording.canvas.style.left =  left - snap.setup + 'px';
                    recording.timeToStart = ((X - snap.setup) / timeSpace.zoom) - recording.offset;
                    bar--;
                }
            } else {
                recording.canvas.style.left = X + 'px';
                recording.timeToStart = (X / timeSpace.zoom) - recording.offset;
            }

            if (is.playing) soundcontroller.playWhileDragging(recording);

            //Cambiar de pista
            if (mousePos.y > sizes.maxHeight || mousePos.y < sizes.minHeight) {
                let newTrack;
                grid.tracks.forEach(track => {
                    sizes = selectTrackHeight(track.tracknumber)
                    if (mousePos.y > sizes.minHeight && mousePos.y < sizes.maxHeight) {
                        newTrack = track;
                        newTrack.trackDOMElement.appendChild(recording.canvas);
                        recording.tracknumber = newTrack.tracknumber;
                    }
                });
            }
        }
    }, false);

    //Recortar bordes de grabaciones

    recording.canvas.addEventListener("mousedown", evt => {

        let mousePos = onMousePos(evt.target, evt);
        offset = recording.offset * timeSpace.zoom;
        duration = recording.duration * timeSpace.zoom;

        offCanvas = (evt.target.selected)
            ? recording.offSelectedCanvas[timeSpace.zoom]
            : recording.offCanvas[timeSpace.zoom];

        if (mousePos.x < 0 + 3 && mousePos.x > 0 - 2) {

            width = offCanvas.width;
            ui_draw.printRecordingCrop(width, recording, offCanvas, offset, duration);
            recording.canvas.style.left = (recording.timeToStart * timeSpace.zoom) + 'px';
            crop_left = true;
            drag = false;

        } else if (mousePos.x < evt.target.width + 3 && mousePos.x > evt.target.width - 3) {

            width = offCanvas.width;
            ui_draw.printRecordingCrop(width, recording, offCanvas, offset, duration);
            recording.canvas.style.left = (recording.timeToStart * timeSpace.zoom) + 'px';
            crop_right = true;
            drag = false;
        }
    });

    recording.canvas.addEventListener("mousemove", evt => {

        let mousePos = onMousePos(evt.target, evt);
        offset = recording.offset * timeSpace.zoom;
        duration = recording.duration * timeSpace.zoom;

        offCanvas = (evt.target.selected)
            ? recording.offSelectedCanvas[timeSpace.zoom]
            : recording.offCanvas[timeSpace.zoom];

        evt.target.style.cursor = (cut) ? 'col-resize'
            : (mousePos.x < 0 + 3 && mousePos.x > 0 - 2) ? 'w-resize'
                : (mousePos.x < evt.target.width + 3 && mousePos.x > evt.target.width - 3) ? 'w-resize'
                    : 'default';

        if (crop_left) {
            offset = (snap.toggle) ?
                snap.setup * Math.round(mousePos.x / snap.setup) :
                Math.max(mousePos.x, 0);
            width = offCanvas.width;
            ui_draw.printRecordingCrop(width, recording, offCanvas, offset, duration);
            evt.target.style.cursor = 'w-resize';
            recording.offset = offset / timeSpace.zoom;

            if (is.playing && parseFloat(cursor.canvas.style.left) < offset + parseFloat(evt.target.style.left))
                soundcontroller.playWhileDragging(recording);
        }
        if (crop_right) {
            duration = (snap.toggle) ?
                snap.setup * Math.round(mousePos.x / snap.setup) :
                Math.max(mousePos.x, 0);
            width = offCanvas.width;
            ui_draw.printRecordingCrop(width, recording, offCanvas, offset, duration);
            evt.target.style.cursor = 'w-resize';
            recording.duration = duration / timeSpace.zoom;

            if (is.playing && parseFloat(cursor.canvas.style.left) < duration + parseFloat(evt.target.style.left))
                soundcontroller.playWhileDragging(recording);
        }
    });

    window.addEventListener("mouseup", evt => {

        drag = false;
        if (crop_left || crop_right) {

            recording.offset = offset / timeSpace.zoom;
            recording.duration = duration / timeSpace.zoom;
            width = Math.ceil(duration - offset);
            if (width > offCanvas.width) width = offCanvas.width;

            ui_draw.printRecording(width, recording, offCanvas, offset, duration);
            crop_left = crop_right = false;
        }
    }, false);

}

function selectTrackHeight(tracknumber) {
    let Yincrement = 60 * tracknumber;
    let heights = {
        minHeight: Yincrement,
        maxHeight: Yincrement + 60
    }
    return heights;
}
