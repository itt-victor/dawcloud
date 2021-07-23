//import { grid } from '../components/generalgrid';
import { grid } from '../app_core';
import { ui_draw } from '../ui/ui_draw';
import { timeSpace } from '../timeSpace';
import Recording from '../components/recording';
import { editRecording } from './editRecordings';
import { copyPaste } from './copyPaste';
import { generateRecordingId } from '../utils';
import { removeRecording } from './actions';
import { onMousePos } from '../utils';

export let cut = false;
export const cutRecording = (recording: Recording) => {

    recording.canvas.addEventListener("click", function (evt) {

        const mousePos = onMousePos(this, evt);
        let offCanvas = (recording.selected)
                ? recording.offSelectedCanvas[timeSpace.zoom]
                : recording.offCanvas[timeSpace.zoom];

        if (cut) {
            //Se modifica el recording existente (izquierda)
            let offset = recording.offset * timeSpace.zoom,
                duration = mousePos.x,
                width = Math.ceil(duration - offset);
            recording.duration = duration / timeSpace.zoom;
            const args = {width, recording, offCanvas, offset, duration};
            ui_draw.printRecording(args);

            //Se genera info para el nuevo recording y se crea
            let timeToStart = (parseFloat(this.style.left) + mousePos.x) / timeSpace.zoom; //esto es raro

            let newRecording = new Recording(
                generateRecordingId(),
                timeToStart,
                recording.audioBuffer,
                recording.tracknumber,
                recording.duration, //aquí es el offset
                recording.audioBuffer.duration
            );
            newRecording.offCanvas = recording.offCanvas;
            newRecording.offSelectedCanvas = recording.offSelectedCanvas;
            offCanvas = newRecording.offSelectedCanvas[timeSpace.zoom];
            offset = newRecording.offset * timeSpace.zoom;
            duration = newRecording.duration * timeSpace.zoom;
            width = Math.ceil(duration - offset);
            grid.recordings.push(newRecording);
            grid.tracks[newRecording.tracknumber].trackDOMElement.appendChild(newRecording.canvas);
            newRecording.canvas.classList.add("recording");
            newRecording.canvas.id = newRecording.id;
            const cutArgs = {width, recording: newRecording, offCanvas, offset, duration};
            ui_draw.printCutRecording(cutArgs);
            //newRecording.canvas.style.left = (newRecording.timeToStart * timeSpace.zoom) + 'px';
            editRecording(newRecording);
            cutRecording(newRecording);
            copyPaste(newRecording);
            removeRecording(newRecording);
        }
    });
}

const cutButton = document.querySelector('#cut_function') as HTMLButtonElement,
    normalButton = document.querySelector('#normal_function') as HTMLButtonElement;

cutButton.addEventListener('click', function () {
    cut = true;
    this.style.background = "red";
    this.disabled = true;
    normalButton.style.background = "";
    normalButton.disabled = false;
});
normalButton.addEventListener('click', function () {
    cut = false;
    this.style.background = "red";
    this.disabled = true;
    cutButton.style.background = "";
    cutButton.disabled = false;
});
