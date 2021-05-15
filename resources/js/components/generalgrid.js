import { cursor } from './cursor';
import Track from './track';
import { generateTrackNumbers } from '../utils';
import {timeSpace}  from '../timeSpace';
var trackName;
var recordings;

export var grid = {
    howMany: document.getElementsByClassName('track').length,
    cursor: cursor,
    canvas: document.createElement('canvas'),
    tracks: [],
    recordings: [],

    addTracks(howMany) {
        for (var i = 0; i < howMany; i++) {
            trackName = generateTrackNumbers();
            window[trackName] = new Track(i);
            grid.tracks.push(window[trackName]);
        }
    },

    addRecordings() {
        for (var i = 0; i < this.tracks.length; i++) {
            recordings= this.tracks[i].recordings;
            for (var h = 0; h < recordings.length; h++){
                this.recordings.push(recordings[h]);
            }
        }
    }
};
grid.addTracks(grid.howMany);
setTimeout(function(){grid.addRecordings();}, 1000);

var tracks = document.getElementsByClassName('tracks')[0];
tracks.appendChild(grid.canvas);
grid.canvas.style.visibility = 'hidden';
grid.canvas.width = 1000;
grid.canvas.height = 70 * grid.howMany;
