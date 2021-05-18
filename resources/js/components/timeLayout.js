import { timeSpace } from '../timeSpace';
import { cursor } from './cursor';
import { soundStatuses } from '../app_core';
import { audioBufferSources } from '../audio/soundcontroller';
import { soundcontroller } from '../app_core';
import { grid } from './generalgrid';


//Interacción con el layout de tiempo
const timeLayout = document.querySelector('#time-layout');

timeLayout.addEventListener('click', function (event) {
    timeSpace.pointedWidth = event.offsetX -1;
    timeSpace.pxIncrement = event.offsetX;
    timeSpace.timeAtPause = (event.offsetX -1) * timeSpace.zoom;  // mirate bien esos -1 que has metido
    cursor.moveAtClick();
    if (soundStatuses.isPlaying == true && soundStatuses.hasStopped == false) {
        soundcontroller.stopSound(audioBufferSources);
        setTimeout(soundcontroller.playSound(grid.tracks),10);
    }
});
