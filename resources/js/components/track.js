
import Recording from './recording';
import { generateRecordingNumbers } from '../utils';
import { ui_draw } from '../ui/ui_draw';
import { grid } from './/generalgrid';
import { audioCtx } from '../app_core';
var rcdName;

export default class Track {
    constructor(tracknumber) {
        this.tracknumber = tracknumber;
        this.trackDOMElement = document.getElementsByClassName('track')[this.tracknumber];
        this.recordings = [];
        this.audioBufferSources = [];
        this.gainNode = audioCtx.createGain();
        this.soloButton = document.getElementById('solo_'+ this.tracknumber);
        this.soloButton.parent = this;
        this.muteButton = document.getElementById('mute_'+ this.tracknumber);
        this.muteButton.parent = this;
        this.soloButton.toggle = false;
        this.muteButton.toggle = false;
        this.fader = document.getElementById('fader_'+ this.tracknumber);
    }
    addRecord(timeToStart, audioBuffer) {
        rcdName = generateRecordingNumbers();
        window[rcdName] = new Recording(timeToStart, audioBuffer, this.tracknumber);
        this.recordings.push(window[rcdName]);
        grid.recordings.push(window[rcdName]);
        this.trackDOMElement.appendChild(window[rcdName].canvas);
        ui_draw.drawRecording(window[rcdName]);
    };
}
