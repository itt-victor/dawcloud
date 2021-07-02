import { timeSpace } from '../timeSpace';
import { cursor } from './cursor';
import { is } from '../app_core';
import { soundcontroller } from '../app_core';
import { snap } from '../ui/ui_snapToGrid';

//Interacción con el layout de tiempo
const timeLayout = document.querySelector('#layout');
let click = false;

timeLayout.addEventListener('mousedown', e => {
    click = true;
    if (snap.toggle)
        snap.setup = timeSpace.zoom * timeSpace.compas * timeSpace.bpm * timeSpace.snap;
    pointTime(e);
});

timeLayout.addEventListener('mousemove', pointTime);

window.addEventListener('mouseup', () => click = false);

function pointTime(event) {
    if (click) {
        timeSpace.space = (snap.toggle)
            ? snap.setup * Math.round(event.offsetX / snap.setup)
			: Math.max(event.offsetX, 0);

        cursor.moveAtClick();
        if (is.playing) {
            soundcontroller.stopSound();
            setTimeout(soundcontroller.playSound(), 10);
        }
    }
}
