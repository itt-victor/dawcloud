import Track from './track';
import { audioCtx } from '../app_core';

export class Grid {

    constructor( gainValue, tracks, recordings) {
        this.howMany = document.querySelectorAll('.track').length;
        this.canvas = document.getElementById('canvas-grid');
        this.gainNode;
        this.gainValue = gainValue;
        this.faderY = 20;
        this.tracks = tracks;
        this.recordings = recordings;
    }

    prepareGrid() {
        this.gainNode = audioCtx.createGain();
        this.gainNode.connect(audioCtx.destination);
        this.canvas.height = 60 * this.howMany;
		this.canvas.style.height = `${60 * this.howMany}px`;
		this.canvas.width = 10000;
        //default la 1a pista
        document.querySelector('.track').setAttribute('data-selected', '');
    }

    addTracks() {
        for (var i = 0; i < this.howMany; i++) {
            let track = new Track(i, 1, 'C');
            track.pannerNode.connect(track.gainNode);
            track.gainNode.connect(this.gainNode);
            grid.tracks.push(track);
        }
    }
}
//La creo
export const grid = new Grid(1, [], []);
