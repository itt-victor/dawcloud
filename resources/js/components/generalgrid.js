import { cursor } from './cursor';
import Track from './track';
import { generateTrackNumbers } from '../utils';
import {timeSpace}  from '../timeSpace';
var trackName;

export var grid = {
    howMany: document.getElementsByClassName('track').length,
    cursor: cursor,
    tracks: { length: 0, add: function add(elem) { [].push.call(this, elem) } },
    //audioBuffers: { length: 0, add: function add(elem) { [].push.call(this, elem) } },


    addTracks(howMany) {
        for (var i = 0; i < howMany; i++) {
            trackName = generateTrackNumbers();
            window[trackName] = new Track(i);
            grid.tracks.add(window[trackName]);
            /*for (var i= 0; i < window[trackName].recordings.length; i++){
                grid.audioBuffers.add(window[trackName].recordings[i]);
            }*/
        }
    }

    //interval: setInterval(update)
};
grid.addTracks(grid.howMany);
//incluye aquí el interval que sea general para todos los componentes
