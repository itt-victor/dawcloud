import { grid } from '../components/generalgrid';
import { generateRecordingId } from '../utils';
import { timeSpace } from '../timeSpace';
import { ui_draw } from '../ui/ui_draw';

export const copyPaste = recording => {

    const keysPressed = {};

    recording.canvas.addEventListener('click', () => {
        if (!recording.copy) {
            document.addEventListener('keydown', event => {
                if (event.ctrlKey) keysPressed[event.key] = true;
                if (event.key === 'c' || event.key === 'C') keysPressed[event.key] = true;
                if (event.key === 'v' || event.key === 'V') keysPressed[event.key] = true;
                if (keysPressed.Control && keysPressed.c) {
                    for (const recording of grid.recordings) recording.copy = false;
                    recording.copy = true;
                }
                if (recording.copy) {
                    if (keysPressed.Control && keysPressed.v) {
                        const trcknr = document.querySelector('[data-selected]').id.charAt(6);
                        const newRecording = grid.tracks[trcknr].addRecord(
                            generateRecordingId(),
                            timeSpace.time(),
                            recording.audioBuffer,
                            recording.offset,
                            recording.duration,
                            true
                        );
                        newRecording.filename = recording.filename;
                        newRecording.offCanvas = recording.offCanvas;
                        newRecording.offSelectedCanvas = recording.offSelectedCanvas;
                        ui_draw.printRecording(
                            newRecording.offCanvas[timeSpace.zoom].width,
                            newRecording,
                            newRecording.offCanvas[timeSpace.zoom],
                            newRecording.offset * timeSpace.zoom,
                            newRecording.duration * timeSpace.zoom
                        );

                        delete keysPressed.Ctrl; delete keysPressed.c; delete keysPressed.v;

                    }
                }
            });
            document.addEventListener('keyup', event => {
                delete keysPressed.Ctrl; delete keysPressed.c; delete keysPressed.v;
            });
        }
    });
}
