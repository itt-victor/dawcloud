
export default class Recording {
    constructor(timeToStart, audioBuffer, tracknumber) {
        this.tracknumber = tracknumber;
        this.timeToStart = timeToStart;
        this.audioBuffer = audioBuffer;
        this.audioBufferSource;
        this.canvas = document.createElement('canvas');
        this.canvasCtx = this.canvas.getContext('2d');
        this.canvas.parent = this;
    }
}

