import { grid } from '../components/generalgrid';
import { soundcontroller } from '../app_core';
import { soundStatuses } from '../app_core';
import { timeSpace } from '../timeSpace';
import { ui_draw } from './ui_draw';
import { cropAudio } from '../audio/bouncecontroller';

export function dragRecording(recording) {

    //arrastrar grabaciones

    var drag = false;
    var crop_left = false;
	var crop_right = false;
    var delta = new Object();
	var leftDelta = 0;
	var rightDelta = 0;
	var cDelta = 0;
    var X = recording.timeToStart * timeSpace.zoom;
    var Y;
	var offset = recording.offset * timeSpace.zoom;
	var duration = recording.duration * timeSpace.zoom;
	var durationReadOnly = (recording.timeToStart + recording.audioBuffer.duration) * timeSpace.zoom;
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
            //X = recording.timeToStart * timeSpace.zoom;
            Y = 0;
            widths = selectTrackWidth(recording.tracknumber);
            let mousePos = onMousePos(grid.canvas, evt);
            if (evt.clientY < widths.maxHeight &&
                evt.clientY > widths.minHeight) {
                drag = true;
                delta.x = X - mousePos.x;
                delta.y = Y - mousePos.y;
            }
        }, false);

        recording.canvas.addEventListener("mousemove", function a(evt) {

            X = recording.timeToStart * timeSpace.zoom;
            Y = 0;
            let mousePos = onMousePos(grid.canvas, evt);
            let heights = selectTrackWidth(recording.tracknumber);
            if (drag) {
                X = mousePos.x + delta.x, Y = evt.clientY;
                if (X + offset < 0) { X = 0 - offset };
                if (Y < heights.minHeight || Y > heights.maxHeight) { drag = false; }

                this.style.left = X + 'px';
                recording.timeToStart = X / timeSpace.zoom;
                if (soundStatuses.isPlaying == true && soundStatuses.hasStopped == false) {
                    soundcontroller.playWhileDragging(recording);
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

            let mousePos = onMousePos(grid.canvas, evt);
			durationReadOnly = (recording.timeToStart + recording.duration) * timeSpace.zoom;
            if (mousePos.x < offset + X + 3 && mousePos.x >  offset + X - 2) {
				leftDelta = offset - mousePos.x;
                crop_left = true;
                drag = false;
			} else if (mousePos.x < durationReadOnly + 3 && mousePos.x > durationReadOnly - 2) {
				rightDelta = duration - mousePos.x + X;
                crop_right = true;
                drag = false;
            }
        });

        recording.canvas.addEventListener("mousemove", function (evt) {
            let mousePos = onMousePos(grid.canvas, evt);
			durationReadOnly = (recording.timeToStart + recording.duration) * timeSpace.zoom;
			console.log(recording.duration);
			if (mousePos.x < offset + X + 3 && mousePos.x >  offset + X - 2) {
				this.style.cursor = 'w-resize';
			}
			else if (mousePos.x < durationReadOnly + 3 && mousePos.x > durationReadOnly - 2) {
                this.style.cursor = 'w-resize';
            } else {
                this.style.cursor = 'default';
            }
            if (crop_left) {
                offset = Math.max(mousePos.x + leftDelta, 0);
				ui_draw.printRecording(recording, recording.offscreenCanvas[timeSpace.zoom], offset, duration);
                this.style.cursor = 'w-resize';
            }
			if (crop_right) {
				duration = Math.max(mousePos.x + leftDelta, 0);

				cDelta = rightDelta - duration;
				ui_draw.printRecording(recording, recording.offscreenCanvas[timeSpace.zoom], cDelta, duration);
				this.style.cursor = 'w-resize';
			}
        });
    }
}

function selectTrackWidth(tracknumber) {
    var incremento = 70 * tracknumber;
    let widths = {
        minHeight: grid.canvas.getBoundingClientRect().top + incremento,
        maxHeight: grid.canvas.getBoundingClientRect().top + incremento + 70,
        minWidth: 0.5,
        maxWidth: 1001.5
    }
    return widths;
}
