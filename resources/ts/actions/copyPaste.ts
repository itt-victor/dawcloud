//import { grid } from '../components/generalgrid';
import { grid } from '../app_core';
import { generateRecordingId } from '../utils';
import { timeSpace } from '../timeSpace';
import { ui_draw } from '../ui/ui_draw';
import recording from '../components/recording';
import { RecordArgs } from '../components/track';

export const copyPaste = (recording: recording) => {

    interface KeysPressed {
        [k: string]: boolean;
    }
    const keysPressed: KeysPressed = {};

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
                        const trck = document.querySelector('[data-selected]') as HTMLElement;
                        const nr = parseInt(trck.id.charAt(6));
                        const recordArgs: RecordArgs = {
                            recordingId: generateRecordingId(),
                            timeToStart: timeSpace.time(),
                            audioBuffer: recording.audioBuffer,
                            offset: recording.offset,
                            duration: recording.duration,
                            copy: true };
                        const newRecording = grid.tracks[nr].addRecord(recordArgs);
                        newRecording.filename = recording.filename;
                        newRecording.offCanvas = recording.offCanvas;
                        newRecording.offSelectedCanvas = recording.offSelectedCanvas;
                        const printArgs = {
                            width: newRecording.offCanvas[timeSpace.zoom].width,
                            recording: newRecording,
                            offCanvas: newRecording.offCanvas[timeSpace.zoom],
                            offset: newRecording.offset * timeSpace.zoom,
                            duration: newRecording.duration * timeSpace.zoom
                        };
                        ui_draw.printRecording(printArgs);

                        delete keysPressed.Ctrl; delete keysPressed.c; delete keysPressed.v;
                        recording.copy = false;
                    }
                }
            });
            document.addEventListener('keyup', event => {
                delete keysPressed.Ctrl; delete keysPressed.c; delete keysPressed.v;
            });
        }
    });
}
