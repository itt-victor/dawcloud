import Track from './track';
import Recording from './recording';
import { audioCtx } from '../app_core';

export class Grid {

    _howMany : number = document.querySelectorAll('.track').length;
    get howMany() {
        return this._howMany;
    }
    set howMany(value) {
        this._howMany = value;
    }

    _gainValue: number;
    get gainValue() {
        return this._gainValue;
    }
    set gainValue(value) {
        this._gainValue = value;
    }

    _faderY: number;
    get faderY() {
        return this._faderY;
    }
    set faderY(value) {
        this._faderY = value;
    }

    canvas = <HTMLCanvasElement>document.getElementById('canvas-grid');
    gainNode = audioCtx.createGain();
    tracks : Track[] = [];
    recordings : Array<Recording> = [];

    constructor() {

        this.gainNode.connect(audioCtx.destination);
        this.canvas.height = 60 * this.howMany;
		this.canvas.style.height = `${60 * this.howMany}px`;
		this.canvas.width = 10000;
        //default la 1a pista
        (document.querySelector('.track') as HTMLInputElement).setAttribute('data-selected', '');
        this._gainValue = 1;
        this._faderY = 20;

        for (let i = 0; i < this.howMany; i++) {
            const track = new Track(i);
            track.pannerNode.connect(track.gainNode);
            track.gainNode.connect(this.gainNode);
            this.tracks.push(track);
        }
    }
}

