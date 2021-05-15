require('../ui/ui_draw');

import Recording from './recording';
import { generateRecordingNumbers } from '../utils';
import { ui_draw } from '../ui/ui_draw';
import {timeSpace}  from '../timeSpace';
var rcdName;

export default class Track {
    constructor(tracknumber) {
        this.tracknumber = tracknumber;
        this.canvas = document.getElementsByClassName('track_canvas')[tracknumber];
        this.canvasCtx = this.canvas.getContext('2d');
        this.canvas.parent = this;
        this.canvas.width = 1000;
        this.canvas.height = 70;
        this.recordings = [];
        //this.audioBuffers = [];
        //aquí cosas del canal, volumen, pan...
    }
    addRecord(timeToStart, offset, audioBuffer) {
        rcdName = generateRecordingNumbers();
        window[rcdName] = new Recording(timeToStart, offset, audioBuffer);
        this.recordings.push(window[rcdName]);
        //this.audioBuffers.push(window[rcdName].audioBuffer);
        ui_draw.drawRecording(window[rcdName], this.canvasCtx);
        ui_draw.drawWaveform(window[rcdName], this.canvasCtx)
    };

    /*drawTrack() {
        //ya veremos, si es necesario llamar para que dibuje la pista entera para que haya dos audios en la misma pista.
    }*/



}
