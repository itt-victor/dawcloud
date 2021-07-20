import Track from './track';
import { audioCtx } from '../app_core';

export class Grid {

    _howMany = document.querySelectorAll('.track').length;
    get howMany() {
        return this._howMany;
    }
    set howMany(value) {
        this._howMany = value;
    }

    _gainValue;
    get gainValue() {
        return this._gainValue;
    }
    set gainValue(value) {
        this._gainValue = value;
    }

    _faderY;
    get faderY() {
        return this._faderY;
    }
    set faderY(value) {
        this._faderY = value;
    }

    canvas = document.getElementById('canvas-grid');
    gainNode = audioCtx.createGain();
    tracks = [];
    recordings = [];

    constructor() {

        this.gainNode.connect(audioCtx.destination);
        this.canvas.height = 60 * this.howMany;
		this.canvas.style.height = `${60 * this.howMany}px`;
		this.canvas.width = 10000;
        //default la 1a pista
        document.querySelector('.track').setAttribute('data-selected', '');
        this.gainValue = 1;
        this.faderY = 20;

        for (let i = 0; i < this.howMany; i++) {
            const track = new Track(i);
            track.pannerNode.connect(track.gainNode);
            track.gainNode.connect(this.gainNode);
            this.tracks.push(track);
        }
    }
}

