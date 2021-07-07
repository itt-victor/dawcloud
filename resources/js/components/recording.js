import { grid } from './generalgrid';

export default class Recording {
    constructor(id, timeToStart, audioBuffer, tracknumber, offset, duration) {
        this.id = id;
        this.filename;
        this.tracknumber = tracknumber;
        this.timeToStart = timeToStart;
        this.offset = offset;
        this.duration = duration;
        this.audioBuffer = audioBuffer;
        this.audioBufferSource;
        this.canvas = document.createElement('canvas');
        this.canvasCtx = this.canvas.getContext('2d');
        this.offCanvas = {};
        this.offSelectedCanvas = {};
    }

    deleteRecording(){
        grid.tracks[this.tracknumber].trackDOMElement.removeChild(this.canvas);
        delete this.canvas;
        delete this.canvasCtx;
        delete this.audioBuffer;
        delete this.audioBufferSource;
    }
}
