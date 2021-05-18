import { timeSpace } from '../timeSpace';
import { grid } from '../components/generalgrid';
import { audioCtx } from '../app_core';

export default class SoundController {

    constructor(audioCtx) {
        this.audioCtx = audioCtx;
        this.audioBufferSources = [];
    }

    loadSound(url, trcknr, startTime) {
        //let trcknr = document.querySelector('[data-selected] > canvas').id;
        //esto para cuando no cargues audio a lo feo, de momento pasa por parámetro, o igual en la funcion a crear.
        const request = new XMLHttpRequest();
        request.open("GET", url, true);
        request.responseType = "arraybuffer";
        request.onload = function () {
            let undecodedAudio = request.response;
            audioCtx.decodeAudioData(undecodedAudio, (data) => {
                var audioBuffer = data;
                grid.tracks[trcknr].addRecord(startTime, audioBuffer, trcknr);//creo recording
            });
        };
        request.send();
    }

    playSound() {
        for (var h = 0; h < grid.recordings.length; h++) {
            const source = audioCtx.createBufferSource();
            source.buffer = grid.recordings[h].audioBuffer;
            source.connect(audioCtx.destination);
            source.connect(grid.tracks[grid.recordings[h].tracknumber].gain)//gain node
            var start = grid.recordings[h].timeToStart - timeSpace.timeAtPause + audioCtx.currentTime;
            var offset = timeSpace.timeAtPause - grid.recordings[h].timeToStart;
            if (start <= 0) {
                start = 0;
            }
            if (offset <= 0) {
                offset = 0;
            }
            source.start(start, offset);
            this.audioBufferSources.push(source);
            grid.recordings[h].audioBufferSource = source;
        }
    }

    stopSound() {
        for (var i = 0; i < this.audioBufferSources.length; i++) {
            this.audioBufferSources[i].stop(0);
        }
        timeSpace.timeAtPause = timeSpace.pxIncrement * timeSpace.zoom;
        this.audioBufferSources = [];
    }

    playWhileDragging(recording) {
        recording.audioBufferSource.stop();
        timeSpace.timeAtPause = timeSpace.pxIncrement * timeSpace.zoom;
        const source = audioCtx.createBufferSource();
        source.buffer = recording.audioBuffer;
        source.connect(audioCtx.destination);
        var start = recording.timeToStart - timeSpace.timeAtPause + audioCtx.currentTime;
        var offset = timeSpace.timeAtPause - recording.timeToStart;
        if (start <= 0) {
            start = 0;
        }
        if (offset <= 0) {
            offset = 0;
        }
        source.start(start, offset);
        recording.audioBufferSource = source;
        this.audioBufferSources.push(source);
    }

}
