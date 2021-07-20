import { grid } from "../app_core";

export default class Recording {

    _id;
    get id() {
        return this._id;
    }
    set id(value) {
        this._id = value;
    }

    _filename;
    get filename() {
        return this._filename;
    }
    set filename(value) {
        this._filename = value;
    }

    _audioBufferSource;
    get audioBufferSource() {
        return this._audioBufferSource;
    }
    set audioBufferSource(value) {
        this._audioBufferSource = value;
    }

    canvas = document.createElement('canvas');
    canvasCtx = this.canvas.getContext('2d');
    offCanvas = {};
    offSelectedCanvas = {};

    constructor(id, timeToStart, audioBuffer, tracknumber, offset, duration) {
        this.id = id;
        this.tracknumber = tracknumber;
        this.timeToStart = timeToStart;
        this.offset = offset;
        this.duration = duration;
        this.audioBuffer = audioBuffer;
    }

    deleteRecording() {
        grid.tracks[this.tracknumber].trackDOMElement.removeChild(this.canvas);
        delete this.canvas;
        delete this.canvasCtx;
        delete this.audioBuffer;
        delete this.audioBufferSource;
    }
}
