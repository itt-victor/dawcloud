import { grid } from '../components/generalgrid';
import { soundcontroller, is } from '../app_core';
import { timeSpace } from '../timeSpace';
import { ui_draw } from '../ui/ui_draw';
import { cursor } from '../components/cursor';
import { cut } from './cutRecordings';
import { snap } from '../ui/ui_snapToGrid';

export const copyPaste = recording => {

    const keysPressed = {};

    recording.canvas.addEventListener('click', e => {
        if (recording.canvas.selected){
            document.addEventListener('keydown', event => {
                if (event.ctrlKey) keysPressed[event.key] = true;
                if (event.key === 'c' || event.key === 'C') keysPressed[event.key] = true;
                if (event.key === 'v' || event.key === 'V') keysPressed[event.key] = true;
                if (keysPressed.Control && keysPressed.c) {
                    for (const recording of grid.recordings) delete recording.copy;
                    recording.copy = true;
                }
                if (keysPressed.Control && keysPressed.v) {
                    if (recording.copy) {
                        const trcknr = document.querySelector('[data-selected]');
                        console.log(trcknr);
                        //const newRecording = grid.tracks[trcknr].addRecording
                    }
                }
            });
            document.addEventListener('keyup', event => {
                delete keysPressed.Ctrl, keysPressed.c, keysPressed.v;
            });
        }
    });
}
