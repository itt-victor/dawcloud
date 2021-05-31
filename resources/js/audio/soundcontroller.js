import { timeSpace } from '../timeSpace';
import { grid } from '../components/generalgrid';
import { audioCtx } from '../app_core';


export default class SoundController {

    constructor(audioCtx) {
        this.audioCtx = audioCtx;
        this.audioBufferSources = [];
    }

    //Esta función sería ya innecesaria
   /* loadSound(url, trcknr, startTime) {
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
    }*/

    playSound() {
        for (var h = 0; h < grid.recordings.length; h++) {
            const source = audioCtx.createBufferSource();
            source.buffer = grid.recordings[h].audioBuffer;
            source.connect(grid.tracks[grid.recordings[h].tracknumber].gainNode)  //gain node asociado a la pista
            var start = Math.max((grid.recordings[h].timeToStart - timeSpace.timeAtPause + audioCtx.currentTime), 0);
            var offset = Math.max((timeSpace.timeAtPause - grid.recordings[h].timeToStart) + grid.recordings[h].offset, 0);
            var duration;
            if (grid.recordings[h].duration){ duration = grid.recordings[h].duration; }
            source.start(start, offset, duration);
            this.audioBufferSources.push(source);
            grid.recordings[h].audioBufferSource = source;
            //source.addEventListener('ended', () => { timeSpace.timeAtPause = timeSpace.pxIncrement * timeSpace.zoom; });
            //esto último y ponderlo en stop parece que es lo mesmo, dejalo en barbecho
        }
    }

    stopSound() {
        for (var i = 0; i < this.audioBufferSources.length; i++) {
            this.audioBufferSources[i].stop();
        }
        timeSpace.timeAtPause = timeSpace.pxIncrement * timeSpace.zoom;    //me refiero a lo que decía en playsound
        this.audioBufferSources = [];
    }

    stopSingleSound(recording) {
        recording.audioBufferSource.stop();
    }

    playWhileDragging(recording) {
        recording.audioBufferSource.stop();
        timeSpace.timeAtPause = timeSpace.pxIncrement * timeSpace.zoom;
        const source = audioCtx.createBufferSource();
        source.buffer = recording.audioBuffer;
        source.connect(grid.tracks[recording.tracknumber].gainNode)  //gain node asociado a la pista
        var start = Math.max((recording.timeToStart - timeSpace.timeAtPause + audioCtx.currentTime), 0);
        var offset = Math.max((timeSpace.timeAtPause - recording.timeToStart), 0);
        var duration;
        if (recording.duration){ duration = recording.duration; }
        source.start(start, offset, duration);
        recording.audioBufferSource = source;
        this.audioBufferSources.push(source);
    }

    mute(gainNode) {
        gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
    }

    solo(gainNode) {
        gainNode.gain.setValueAtTime(gainNode.gainValue, audioCtx.currentTime);
    }



    leftCut() {
        //se aumenta offset por el dith dado source.start(start, offset + cantidad recortada);
    }

    rightCut() {
        //se aumenta duración con source.start(start, offset, source.duration - cantidad recortada);
    }


}
