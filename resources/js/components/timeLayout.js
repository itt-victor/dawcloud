import { timeSpace } from '../timeSpace';
import { cursor } from './cursor';
import { soundStatuses } from '../app_core';
import { soundcontroller } from '../app_core';

//Interacción con el layout de tiempo
const timeLayout = document.querySelector('#layout');
let click = false;

timeLayout.addEventListener('mousedown', function (e) {
    click = true;
    pointTime(e);
});

timeLayout.addEventListener('mousemove', pointTime);

window.addEventListener('mouseup', function () {
    click = false;
});

function pointTime(event) {
    if (click) {
        timeSpace.space = Math.max(event.offsetX, 0);
        cursor.moveAtClick();
        if (soundStatuses.isPlaying == true
            && soundStatuses.hasStopped == false) {
            soundcontroller.stopSound();
            setTimeout(soundcontroller.playSound(), 10);
        }
    }
}


