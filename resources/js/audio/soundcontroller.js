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
            //source.connect(audioCtx.destination);            CUIDAO, AHORA EN VEZ DE CONECTARLO AL OUTPUTDIRECTAMENTE, LO CONECTAS AL GAIN NODE Y ESE YA VA CONECTADO A DESTINATION
            source.connect(grid.tracks[grid.recordings[h].tracknumber].gain)//gain node
            var start = Math.max((grid.recordings[h].timeToStart - timeSpace.timeAtPause + audioCtx.currentTime), 0);
            var offset = Math.max((timeSpace.timeAtPause - grid.recordings[h].timeToStart), 0);
            source.start(start, offset);
            this.audioBufferSources.push(source);
            grid.recordings[h].audioBufferSource = source;
            grid.tracks[grid.recordings[h].tracknumber].audioBufferSources.push(source);//igual esto no hace falta, el nodo ya está atado al darle play
        }
    }

    stopSound() {
        for (var i = 0; i < this.audioBufferSources.length; i++) {
            this.audioBufferSources[i].stop(0);
        }
        timeSpace.timeAtPause = timeSpace.pxIncrement * timeSpace.zoom;
        this.audioBufferSources = [];
    }

    stopSingleSound(recording) {
        recording.audioBufferSource.stop(0);
    }

    playWhileDragging(recording) {
        recording.audioBufferSource.stop();
        timeSpace.timeAtPause = timeSpace.pxIncrement * timeSpace.zoom;
        const source = audioCtx.createBufferSource();
        source.buffer = recording.audioBuffer;
        source.connect(audioCtx.destination);
        var start = Math.max((recording.timeToStart - timeSpace.timeAtPause + audioCtx.currentTime), 0);
        var offset = Math.max((timeSpace.timeAtPause - recording.timeToStart), 0);
        source.start(start, offset);
        recording.audioBufferSource = source;
        this.audioBufferSources.push(source);
        grid.tracks[recording.tracknumber].audioBufferSources.push(source);//igual esto no hace falta, el nodo ya está atado al darle play
    }

    mute(gainNode) {
        gainNode.gain.setValueAtTime(0, audioCtx.currentTime);//hay que mirar como hacer toggle
    }

    solo(gainNode) {
      //este es más complicated
    }

}
