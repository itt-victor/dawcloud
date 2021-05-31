import { timeSpace } from '../timeSpace';
import { cursor } from './cursor';
import { soundStatuses } from '../app_core';
import { soundcontroller } from '../app_core';
import { grid } from './generalgrid';


//Interacción con el layout de tiempo
const timeLayout = document.querySelector('#time-layout');

timeLayout.addEventListener('click', function (event) {
    timeSpace.pointedWidth = Math.max(event.offsetX, 0);
    timeSpace.pxIncrement = Math.max(event.offsetX, 0);
    timeSpace.timeAtPause = Math.max(event.offsetX, 0) * timeSpace.zoom;
    cursor.moveAtClick();
    if (soundStatuses.isPlaying == true && soundStatuses.hasStopped == false) {
        soundcontroller.stopSound(soundcontroller.audioBufferSources);
        setTimeout(soundcontroller.playSound(grid.tracks),10);
    }
});
