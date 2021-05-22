import Track from './track';
import { generateTrackNumbers } from '../utils';
import { audioCtx } from '../app_core';
var trackName;
var recordings;

export class Grid {

    constructor( tracks, recordings) {
        this.howMany = document.getElementsByClassName('track').length;
        this.canvas = document.createElement('canvas');
        this.gainNode;
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

    addTracks(howMany) {
        for (var i = 0; i < howMany; i++) {
            trackName = generateTrackNumbers();
            window[trackName] = new Track(i, 1); //ese 1 es por el gainNode, mirateo de cara a guardar project
            window[trackName].gainNode.connect(this.gainNode);
            grid.tracks.push(window[trackName]);
        }
    }

    addRecordings() {
        for (var i = 0; i < this.tracks.length; i++) {
            recordings = this.tracks[i].recordings;
            for (var h = 0; h < recordings.length; h++) {
                this.recordings.push(recordings[h]);
            }
        }
    }
}
//La creo
export var grid = new Grid([], []);
