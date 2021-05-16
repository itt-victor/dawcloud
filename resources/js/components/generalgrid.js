import Track from './track';
import { generateTrackNumbers } from '../utils';
var trackName;
var recordings;

class Grid {

    constructor() {
        this.howMany = document.getElementsByClassName('track').length;
        this.canvas = document.createElement('canvas');

        this.tracks = [];
        this.recordings = [];

    }

    prepareCanvas() {
        let tracks = document.getElementById('tracks');
        tracks.appendChild(this.canvas);
        this.canvas.style.visibility = 'hidden';
        this.canvas.width = 1000;
        this.canvas.height = 70 * this.howMany;
        //default la 1a pista
        jQuery(".track:first").attr("data-selected", '');
    }
    //MÉTODO NO NECESARIO
    addTracks(howMany) {
        for (var i = 0; i < howMany; i++) {
            trackName = generateTrackNumbers();
            window[trackName] = new Track(i);
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
export var grid = new Grid();
