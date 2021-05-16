import { timeSpace } from '../timeSpace';
import { grid } from '../components/generalgrid';
import { audioCtx } from '../app_core';


//Esto aquí mismo ya que se se pierden en cada play
export var audioBufferSources = [];

export default class SoundController {

    constructor(audioCtx) {
        this.audioCtx = audioCtx;
    }

    /*getAudioBuffers() {
        return audioBuffers;
    }*/

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
            var start = grid.recordings[h].timeToStart - timeSpace.timeAtPause + audioCtx.currentTime;
            var offset = timeSpace.timeAtPause - grid.recordings[h].timeToStart;
            if (start <= 0) {
                start = 0;
            }
            if (offset <= 0) {
                offset = 0;
            }
            source.start(start, offset);
            audioBufferSources.push(source);
            grid.recordings[h].audioBufferSource = source;
        }
    }

    stopSound(sources) {
        for (var i = 0; i < sources.length; i++) {
            sources[i].stop(0);
        }
        timeSpace.timeAtPause = timeSpace.pxIncrement * timeSpace.zoom;
        audioBufferSources = [];
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
        audioBufferSources.push(source);
    }

}
