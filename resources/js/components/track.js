import Recording from './recording';
import { ui_draw } from '../ui/ui_draw';
import { grid, audioCtx } from '../app_core';
import { editRecording } from '../actions/editRecordings';
import { copyPaste } from '../actions/copyPaste';
import { removeRecording } from '../actions/actions';
import { timeSpace } from '../timeSpace';
import { cutRecording } from '../actions/cutRecordings';

export default class Track {

    _tracknumber;
    get tracknumber() {
        return this._tracknumber;
    }
    set tracknumber(value) {
        this._tracknumber = value;
    }

    _name;
    get name() {
        return this._name;
    }
    set name(value) {
        this._name = value;
    }

    trackDOMElement;
    pannerNode = audioCtx.createStereoPanner();
    gainNode = audioCtx.createGain();

    constructor(tracknumber) {
        this.tracknumber = tracknumber;
        this.trackDOMElement = document.getElementsByClassName('track')[this.tracknumber];
        this.pannerNode.pannerValue = 'C';
        this.gainNode.gainValue = 1;
        this.soloButton = document.getElementById('solo_' + this.tracknumber);
        this.soloButton.parent = this;
        this.soloButton.toggle = false;
        this.muteButton = document.getElementById('mute_' + this.tracknumber);
        this.muteButton.parent = this;
        this.muteButton.toggle = false;
        this.fader = document.getElementById('fader_' + this.tracknumber);
        this.fader.Y = 20;
    }
    addRecord(recordingId, timeToStart, audioBuffer, offset, duration, copy) {
        let recording = new Recording(recordingId, timeToStart, audioBuffer, this.tracknumber, offset, duration);
        grid.recordings.push(recording);
        this.trackDOMElement.appendChild(recording.canvas);
        recording.canvas.classList.add("recording");
        recording.canvas.id = recording.id;
        if (!copy) drawwaveforms(recording);
        setTimeout(editRecording(recording), 20);
        setTimeout(cutRecording(recording), 20);
        setTimeout(copyPaste(recording), 20);
        setTimeout(removeRecording(recording), 20);

        return recording;
    };
}

function drawwaveforms(recording) {
    const zoomArray = []; let zoom = 5;
    const offset = recording.offset * timeSpace.zoom;
    const duration = recording.duration * timeSpace.zoom;

    while (zoom <= 889) {
        zoomArray.push(zoom);
        zoom = Math.round(zoom * 1.25);
    }
    for (const zoom of zoomArray) {
        recording.offCanvas[zoom] = ui_draw.drawRecording(recording, zoom, false);
        recording.offSelectedCanvas[zoom] = ui_draw.drawRecording(recording, zoom, true);
    }

    ui_draw.printRecording(
        recording.offCanvas[timeSpace.zoom].width,
        recording,
        recording.offCanvas[timeSpace.zoom],
        offset,
        duration
    );
}
