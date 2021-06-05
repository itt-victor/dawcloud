import { grid } from './generalgrid';
import { generateRecordingId } from '../utils';

export default class Recording {
    constructor(timeToStart, audioBuffer, tracknumber) {
        this.id = generateRecordingId();
        this.tracknumber = tracknumber;
        this.timeToStart = timeToStart;
        this.offset = 0;
        this.duration;
        this.audioBuffer = audioBuffer;
        this.audioBufferSource;
        this.canvas = document.createElement('canvas');
        this.canvasCtx = this.canvas.getContext('2d');
    }

    deleteRecording(){
        canvasCtx.clearRect(0, 0, 4000, 70);
        grid.tracks[this.tracknumber].trackDOMElement.removeChild(this.canvas);
        delete this.canvas;
        delete this.canvasCtx;
        delete this.audioBuffer;
        delete this.audioBufferSource;
    }
}
