import Recording from './recording';
import { generateRecordingNumbers } from '../utils';
import {timeSpace}  from '../timeSpace';
var rcdName;

export default class Track {
    constructor(tracknumber) {
        this.tracknumber = tracknumber;
        this.canvas = document.getElementsByClassName('track_canvas')[tracknumber];
        this.canvasCtx = this.canvas.getContext('2d');
        this.canvas.width = 1000;
        this.canvas.height = 80;
        this.recordings = { length: 0, add: function add(elem) { [].push.call(this, elem) } };
        this.audioBuffers = {length: 0, add: function add(elem) { [].push.call(this, elem) } };
        //this.audioBufferSources = { length: 0, add: function add(elem) { [].push.call(this, elem) } };
        //aquí cosas del canal, volumen, pan...
    }
    addRecord(timeToStart, offset, audioBuffer) {
        rcdName = generateRecordingNumbers();
        window[rcdName] = new Recording(timeToStart, offset, audioBuffer, this.canvasCtx);
        this.recordings.add(window[rcdName]);
        this.audioBuffers.add(window[rcdName].audioBuffer);
        window[rcdName].drawRecording();
    };



}




//var generateTrackNumbers() = new Recording
