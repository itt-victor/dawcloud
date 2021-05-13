import Recording from './recording';

export class Track {
    constructor(howMany) {
        this.canvas = document.getElementsByClassName('track_canvas')[howMany];
        this.canvas.width = 1000;
        this.canvas.height = 80;
        this.trackRecordings = [];
//aquí cosas del canal, volumen, pan...
        }
    addRecord(record) { this.trackRecordings.push(record) };

}




//var generateTrackNumbers() = new Recording
