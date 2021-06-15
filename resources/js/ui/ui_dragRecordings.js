import { grid } from '../components/generalgrid';
import { soundcontroller } from '../app_core';
import { soundStatuses } from '../app_core';
import { timeSpace } from '../timeSpace';
import { ui_draw } from './ui_draw';
import { cropAudio } from '../audio/bouncecontroller';

export function dragRecording(recording) {

    //arrastrar grabaciones

    var drag = false;
    var mod = false;
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

            X = recording.timeToStart * timeSpace.zoom;
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
                if (X < 0) { X = 0 };
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

			if (mod) {
                let croppedCanvas = document.createElement('canvas');
                croppedCanvas.getContext('2d').drawImage(recording.canvas, 0, 0);
                recording.croppedCanvas = croppedCanvas;
                recording.croppedCanvas.x = X;
                recording.offset = X / timeSpace.zoom;
				recording.timeToStart += (X / timeSpace.zoom);
				mod = false;
            }
        }, false);

        //Recortar grabaciones

        recording.canvas.addEventListener("mousedown", function (evt) {
            let mousePos = onMousePos(grid.canvas, evt);
            if (recording.croppedCanvas) {
                X = recording.croppedCanvas.x
            } else {
                X = recording.timeToStart * timeSpace.zoom;
            }
            if (mousePos.x < X + 3 && mousePos.x > X - 2) {
                delta.x = Math.max(X, 0);
                mod = true;
                drag = false;
            }
        });

        recording.canvas.addEventListener("mousemove", function (evt) {
            let mousePos = onMousePos(grid.canvas, evt);
            if (mousePos.x < X + 3 && mousePos.x > X - 2) {
                this.style.cursor = 'w-resize';
            } else {
                this.style.cursor = 'default';
            }
            if (mod) {
                X = mousePos.x - delta.x;

                ui_draw.printRecording(recording, recording.offscreenSelectedCanvas[timeSpace.zoom])
                ui_draw.drawWhileCropping(this, X);
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
