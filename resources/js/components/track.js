import Recording from './recording';
import { ui_draw } from '../ui/ui_draw';
import { grid } from './generalgrid';
import { audioCtx } from '../app_core';
import { editRecording } from '../ui/ui_editRecordings';
import { removeRecording } from '../actions';
import { timeSpace } from '../timeSpace';
import { cutRecording } from '../ui/ui_cutRecordings';

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
        let recording = new Recording(recordingId, timeToStart, audioBuffer, this.tracknumber, offset, duration);
        grid.recordings.push(recording);
        this.trackDOMElement.appendChild(recording.canvas);
        recording.canvas.classList.add("recording");
        recording.canvas.id = recording.id;
        drawwaveforms(recording);
        setTimeout(editRecording(recording), 20);
        setTimeout(cutRecording(recording), 20);
        setTimeout(removeRecording(recording), 20);
    };
}

function drawwaveforms(recording) {
    let zoom = 5, zoomArray = [],
     	offset = recording.offset * timeSpace.zoom,
     	duration = recording.duration * timeSpace.zoom;

    while (zoom <= 889) {
        zoomArray.push(zoom);
        zoom = Math.round(zoom * 1.25);
    }
    for (const zoom of zoomArray) {
        recording.offCanvas[zoom] = ui_draw.drawRecording(recording, zoom);
        recording.offSelectedCanvas[zoom] = ui_draw.selectedRecording(recording, zoom);
    }

    ui_draw.printRecording(
        recording.offCanvas[timeSpace.zoom].width,
        recording,
        recording.offCanvas[timeSpace.zoom],
        offset,
        duration
    );
}
