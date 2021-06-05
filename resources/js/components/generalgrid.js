import Track from './track';
import { generateTrackNumbers } from '../utils';
import { audioCtx } from '../app_core';
var trackName;
var recordings;

export class Grid {

    constructor( gainValue, tracks, recordings) {
        this.howMany = document.getElementsByClassName('track').length;
        this.canvas = document.createElement('canvas');
        this.gainNode;
        this.gainValue = gainValue;
        this.faderY = 20;
        this.tracks = tracks;
        this.recordings = recordings;
    }

    prepareGrid() {
        let tracks = document.getElementById('tracks');
        tracks.appendChild(this.canvas);
        this.gainNode = audioCtx.createGain();
        this.gainNode.connect(audioCtx.destination);
        this.canvas.style.visibility = 'hidden';
        this.canvas.width = 1000;
        this.canvas.height = 70 * this.howMany;
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
