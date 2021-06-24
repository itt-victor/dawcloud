import { grid } from '../components/generalgrid';
import { ui_draw } from './ui_draw';
import { timeSpace } from '../timeSpace';
import Recording from '../components/recording';
import { editRecording } from './ui_editRecordings';
import { generateRecordingId } from '../utils';
import { removeRecording } from '../app_logic';


export let cut = false;
export function cutRecording(recording) {

    function onMousePos(canvas, evt) {
        let rect = canvas.getBoundingClientRect();
        return {
            x: Math.round(evt.clientX - rect.left),
            y: Math.round(evt.clientY - rect.top)
        };
    }

    recording.canvas.addEventListener("click", function (evt) {

        let mousePos = onMousePos(this, evt);
        let offCanvas = (this.selected)
            ? recording.offSelectedCanvas[timeSpace.zoom]
            : recording.offCanvas[timeSpace.zoom];

        if (cut) {
            //Se modifica el recording existente (izquierda)
            let offset = recording.offset * timeSpace.zoom;
            let duration = mousePos.x;
            let width = Math.ceil(duration - offset);
            recording.duration = duration / timeSpace.zoom;
            ui_draw.printRecording(width, recording, offCanvas, offset, duration);

            //Se genera info para el nuevo recording y se crea
            let timeToStart = parseFloat(this.style.left) + (mousePos.x / timeSpace.zoom); //esto es raro

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
            ui_draw.printRecording(width, newRecording, offCanvas, offset, duration);
            //newRecording.canvas.style.left = (newRecording.timeToStart * timeSpace.zoom) + 'px';
            setTimeout(editRecording(newRecording), 20);
            setTimeout(cutRecording(newRecording), 20);
            setTimeout(removeRecording(newRecording), 20);
        }
    });
}

const cutButton = document.querySelector('#cut_function');
const normalButton = document.querySelector('#normal_function');

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
