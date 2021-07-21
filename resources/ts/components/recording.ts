import { grid } from "../app_core";
import { timeSpace } from "../timeSpace";
import { ui_draw } from "../ui/ui_draw";

export default class Recording {

    private readonly _id: string;
    public get id() {
        return this._id;
    }
    private _tracknumber: number;
    public get tracknumber() {
        return this._tracknumber;
    }
    public set tracknumber(value) {
        this._tracknumber = value;
    }

    private _filename: string | undefined;
    public get filename() {
        return this._filename;
    }
    public set filename(value) {
        this._filename = value;
    }

    timeToStart: number;
    offset: number;
    duration: number;
    audioBuffer: AudioBuffer;
    audioBufferSource: AudioBufferSourceNode | undefined;

    canvas: HTMLCanvasElement = document.createElement('canvas');
    canvasCtx = this.canvas.getContext('2d') as CanvasRenderingContext2D;
    offCanvas: { [zoom: number]: HTMLCanvasElement; } = {};
    offSelectedCanvas: { [zoom: number]: HTMLCanvasElement; } = {};

    copy!: boolean;
    selected!: boolean;

    constructor(id: string, timeToStart: number, audioBuffer: AudioBuffer, tracknumber: number, offset: number, duration: number) {
        this._id = id;
        this._tracknumber = tracknumber;
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
        this.canvas.remove();
        /* delete this.canvasCtx;
        delete this.audioBuffer; */
        delete this.audioBufferSource;
    }
}
/*
interface OffCanvas {
    [index: number]: HTMLCanvasElement
} */
