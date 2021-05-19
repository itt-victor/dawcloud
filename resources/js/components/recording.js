import { generateRecordingId } from '../utils';

export default class Recording {
    constructor(timeToStart, audioBuffer, tracknumber) {
        this.id = generateRecordingId();
        this.tracknumber = tracknumber;
        this.timeToStart = timeToStart;
        this.audioBuffer = audioBuffer;
        this.audioBufferSource;
        this.canvas = document.createElement('canvas');
        this.canvasCtx = this.canvas.getContext('2d');
        //this.canvas.style.overflowX = 'hidden';
        this.canvas.parent = this;
    }

    deleteRecording(){
        this.canvasCtx.clearRect(0, 0, 4000, 70);
        //delete this.canvas;
        //delete this.canvasCtx;
        delete this.audioBuffer;
        delete this.audioBufferSource;
    }
}
