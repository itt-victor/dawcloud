
import Recording from './recording';
import { generateRecordingNumbers } from '../utils';
import { ui_draw } from '../ui/ui_draw';
import { grid } from './/generalgrid';
var rcdName;

export default class Track {
    constructor(tracknumber) {
        this.tracknumber = tracknumber;
        this.track = document.getElementsByClassName('track')[this.tracknumber];
        this.recordings = [];
        //aquí cosas del canal, volumen, pan...
        this.soloButton = document.getElementById('solo_'+ this.tracknumber);
        this.muteButton = document.getElementById('mute_'+ this.tracknumber);
        this.fader = document.getElementById('fader_'+ this.tracknumber);
    }
    addRecord(timeToStart, audioBuffer) {
        rcdName = generateRecordingNumbers();
        window[rcdName] = new Recording(timeToStart, audioBuffer, this.tracknumber);
        this.recordings.push(window[rcdName]);
        grid.recordings.push(window[rcdName]);
        this.track.appendChild(window[rcdName].canvas);
        ui_draw.drawRecording(window[rcdName]);
    };
}

