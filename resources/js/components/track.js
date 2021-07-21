import Recording from './recording';
import { grid, audioCtx } from '../app_core';
import { editRecording } from '../actions/editRecordings';
import { copyPaste } from '../actions/copyPaste';
import { removeRecording } from '../actions/actions';
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
        this.soloButton = document.getElementById(`solo_${this.tracknumber}`);
        this.soloButton.parent = this;
        this.soloButton.toggle = false;
        this.muteButton = document.getElementById(`mute_${this.tracknumber}`);
        this.muteButton.parent = this;
        this.muteButton.toggle = false;
        this.fader = document.getElementById(`fader_${this.tracknumber}`);
        this.fader.Y = 20;
    }
    addRecord(recordingId, timeToStart, audioBuffer, offset, duration, copy) {
        let recording = new Recording(recordingId, timeToStart, audioBuffer, this.tracknumber, offset, duration);
        grid.recordings.push(recording);
        this.trackDOMElement.appendChild(recording.canvas);
        recording.canvas.classList.add("recording");
        recording.canvas.id = recording.id;
        if (!copy) recording.drawwaveforms();
        editRecording(recording);
        cutRecording(recording);
        copyPaste(recording);
        removeRecording(recording);

        return recording;
    };
}
