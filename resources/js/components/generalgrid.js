import Track from './track';
import { generateTrackNumbers } from '../utils';
import { audioCtx } from '../app_core';
var trackName;
var recordings;

export class Grid {

    constructor( gainValue, tracks, recordings) {
        this.howMany = document.getElementsByClassName('track').length;
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
		this.canvas.style.height = 60 * this.howMany + 'px';
		this.canvas.width = 10000;
        //default la 1a pista
        jQuery(".track:first").attr("data-selected", '');
    }

    addTracks() {
        for (var i = 0; i < this.howMany; i++) {
            trackName = generateTrackNumbers();
            window[trackName] = new Track(i, 1, 'C');
            window[trackName].pannerNode.connect(window[trackName].gainNode);
            window[trackName].gainNode.connect(this.gainNode);
            grid.tracks.push(window[trackName]);
        }
    }
}
//La creo
export var grid = new Grid(1, [], []);
