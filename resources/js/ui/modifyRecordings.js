/*import { grid } from '../components/generalgrid';
import { soundcontroller } from '../app_core';
import { soundStatuses } from '../app_core';
import { timeSpace } from '../timeSpace';*/

export function modifyRecording(recording) {
    var mod = false;
    var delta = new Object();
    var X;
    var Xoffset;
    var Y;

    function onMousePos(canvas, evt) {
        var rect = canvas.getBoundingClientRect();
        return {
            x: Math.round(evt.clientX - rect.left),
            y: Math.round(evt.clientY - rect.top)
        };
    }

        if (recording.canvas != undefined) {
            recording.canvas.addEventListener("mousemove", function (evt) {

                X = this.getBoundingClientRect().x;
                Xoffset = this.getBoundingClientRect().x + this.getBoundingClientRect().width;
                if (evt.clientX < X + 0.5 && evt.clientX > X - 0.5){
                    this.style.cursor = 'w-resize';
                    mod[i] = true;

                    this.addEventListener("mousedown", function (evt) {
                        evt.target.width -= evt.offsetX;
                    });
                }
                else {
                    this.style.cursor = 'default';
                }
            });
        }
}

