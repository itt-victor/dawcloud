import { grid } from '../components/generalgrid';
import { soundcontroller } from '../app_core';
import { soundStatuses } from '../app_core';
import { timeSpace } from '../timeSpace';

export function cutRecording() {

    var recording;
    var duration;
    var initialTime;
    var cut = false;

    const cutButton = document.querySelector('#cut_function');
    const normalButton = document.querySelector('#normal_function');

    cutButton.addEventListener('click', function () {
        document.body.style.cursor = 'text';
        cut = true;
    });
    normalButton.addEventListener('click', function () {
        document.body.style.cursor = 'default';
        cut = false;
    });

    function onMousePos(canvas, evt) {
        var rect = canvas.getBoundingClientRect();
        return {
            x: Math.round(evt.clientX - rect.left),
            y: Math.round(evt.clientY - rect.top)
        };
    }

    for (var i = 0; i < grid.recordings.length; i++) {

        if (grid.recordings[i].canvas != undefined) {
            grid.recordings[i].canvas.addEventListener("click", function (evt) {

                for (var i = 0; i < grid.recordings.length; i++) {
                    if (cut) {
                        if (evt.target.id === grid.recordings[i].id) {

                            recording = grid.recordings[i];
                            duration = evt.offsetX * timeSpace.zoom;
                            recording.duration = duration;
                            recording.canvas.width -= evt.offsetX;
                        }
                    }
                }
            });
        }
    }
}
