import { grid } from "../app_core";
import { timeSpace } from "../timeSpace";
import { ui_draw } from '../ui/ui_draw';

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

    drawwaveforms() {
        const zoomArray = []; let zoom = 5;
        const offset = this.offset * timeSpace.zoom;
        const duration = this.duration * timeSpace.zoom;

        while (zoom <= 889) {
            zoomArray.push(zoom);
            zoom = Math.round(zoom * 1.25);
        }
        for (const zoom of zoomArray) {
            this.offCanvas[zoom] = ui_draw.drawRecording(this, zoom, false);
            this.offSelectedCanvas[zoom] = ui_draw.drawRecording(this, zoom, true);
        }

        ui_draw.printRecording(
            this.offCanvas[timeSpace.zoom].width,
            this,
            this.offCanvas[timeSpace.zoom],
            offset,
            duration
        );
    }

    deleteRecording() {
        grid.tracks[this.tracknumber].trackDOMElement.removeChild(this.canvas);
        delete this.canvas;
        delete this.canvasCtx;
        delete this.audioBuffer;
        delete this.audioBufferSource;
    }
}
