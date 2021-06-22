import Recording from './recording';
import { generateRecordingNumbers } from '../utils';
import { ui_draw } from '../ui/ui_draw';
import { grid } from './generalgrid';
import { audioCtx } from '../app_core';
import { editRecording } from '../ui/ui_editRecordings';
import { removeRecording } from '../app_logic';
import { timeSpace } from '../timeSpace';
import {cutRecording } from '../ui/ui_cutRecordings';

var rcdName;

export default class Track {
    constructor(tracknumber, gainValue, pannerValue) {
        this.tracknumber = tracknumber;
        this.name;
        this.trackDOMElement = document.getElementsByClassName('track')[this.tracknumber];
        this.pannerNode = audioCtx.createStereoPanner();
        this.pannerNode.pannerValue = pannerValue;
        this.gainNode = audioCtx.createGain();
        this.gainNode.gainValue = gainValue;
        this.soloButton = document.getElementById('solo_' + this.tracknumber);
        this.soloButton.parent = this;
        this.soloButton.toggle = false;
        this.muteButton = document.getElementById('mute_' + this.tracknumber);
        this.muteButton.parent = this;
        this.muteButton.toggle = false;
        this.fader = document.getElementById('fader_' + this.tracknumber);
        this.fader.Y = 20;
    }
    addRecord(recordingId, timeToStart, audioBuffer, offset, duration) {
        rcdName = generateRecordingNumbers();
        window[rcdName] = new Recording(recordingId, timeToStart, audioBuffer, this.tracknumber, offset, duration);
        grid.recordings.push(window[rcdName]);
        this.trackDOMElement.appendChild(window[rcdName].canvas);
        window[rcdName].canvas.classList.add("recording");
        window[rcdName].canvas.id = window[rcdName].id;
        drawwaveforms(window[rcdName]);
        setTimeout(editRecording(window[rcdName]), 20);
        setTimeout(cutRecording(window[rcdName]), 20);
        setTimeout(removeRecording(window[rcdName]), 20);
    };
}

function drawwaveforms(recording) {
    let zoom = 5;
    let offset = recording.offset * timeSpace.zoom;
    let duration = recording.duration * timeSpace.zoom;

    while (zoom <= 889) {
        recording.offCanvas[zoom] = ui_draw.drawRecording(recording, zoom);
        recording.offSelectedCanvas[zoom] = ui_draw.selectedRecording(recording, zoom);
        zoom = Math.round(zoom * 1.25);
    }
    ui_draw.printRecording(
        recording.offCanvas[timeSpace.zoom].width,
        recording,
		recording.offCanvas[timeSpace.zoom],
        offset,
        duration
    );
}
