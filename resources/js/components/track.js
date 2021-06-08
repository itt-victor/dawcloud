import Recording from './recording';
import { generateRecordingNumbers } from '../utils';
import { ui_draw } from '../ui/ui_draw';
import { grid } from './generalgrid';
import { audioCtx } from '../app_core';
import { dragRecording } from '../ui/ui_dragRecordings';
import { removeRecording } from '../app_logic';

var rcdName;

export default class Track {
    constructor(tracknumber, gainValue, pannerValue) {
        this.tracknumber = tracknumber;
        this.trackDOMElement = document.getElementsByClassName('track')[this.tracknumber];
        this.pannerNode = audioCtx.createStereoPanner();
        this.pannerNode.pannerValue = pannerValue;
        this.gainNode = audioCtx.createGain();
        this.gainNode.gainValue = gainValue;
        this.soloButton = document.getElementById('solo_'+ this.tracknumber);
        this.soloButton.parent = this;
        this.soloButton.toggle = false;
        this.muteButton = document.getElementById('mute_'+ this.tracknumber);
        this.muteButton.parent = this;
        this.muteButton.toggle = false;
        this.fader = document.getElementById('fader_'+ this.tracknumber);
        this.fader.Y = 20;
        this.fader.parent = this;
    }
    addRecord(recordingId, timeToStart, audioBuffer) {
        rcdName = generateRecordingNumbers();
        window[rcdName] = new Recording(recordingId, timeToStart, audioBuffer, this.tracknumber);
        grid.recordings.push(window[rcdName]);
        this.trackDOMElement.appendChild(window[rcdName].canvas);
        ui_draw.drawRecording(window[rcdName]);
        setTimeout(dragRecording(window[rcdName]), 20);
        setTimeout(removeRecording(window[rcdName]), 20);
    };
}
