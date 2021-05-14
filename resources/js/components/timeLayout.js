import { timeSpace } from '../timeSpace';
import { cursor } from './cursor';
import { soundStatuses } from '../app_core';
import { audioBufferSources } from '../audio/soundcontroller';
import { soundcontroller } from '../app_core';
import { grid } from './generalgrid';


//Interacción con el layout de tiempo
const timeLayout = document.querySelector('#time-layout');

timeLayout.addEventListener('click', function (event) {
    timeSpace.pointedWidth = event.clientX;
    timeSpace.pxAtPause = event.clientX - 610;
    timeSpace.timeAtPause = timeSpace.pxAtPause / 5;
    cursor.moveAtClick(timeSpace.pointedWidth);
    if (soundStatuses.isPlaying == true && soundStatuses.hasStopped == false) {
        soundcontroller.stopSound(audioBufferSources);
        soundcontroller.playSound(grid.tracks);
    }
});
