import { timeSpace } from '../timeSpace';
import { grid } from '../components/generalgrid';
import { audioCtx } from '../app_core';

let isMuted = false;
let isSolo = false;

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
            source.connect(grid.tracks[grid.recordings[h].tracknumber].gainNode)  //gain node asociado a la pista
            var start = Math.max((grid.recordings[h].timeToStart - timeSpace.timeAtPause + audioCtx.currentTime), 0);
            var offset = Math.max((timeSpace.timeAtPause - grid.recordings[h].timeToStart), 0);
            source.start(start, offset/*, 4*/);
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
        source.start(start, offset);
        recording.audioBufferSource = source;
        this.audioBufferSources.push(source);
    }

    mute(gainNode) {
        if (isMuted === false) {
            gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
            isMuted = true;
        }
        else {
            gainNode.gain.setValueAtTime(1, audioCtx.currentTime);
            isMuted = false;
        }
    }
    //mirate esta mierda
    solo(gainNode) {
        if (isSolo === false) {
            gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
        }
        isMuted = true;
    }

    //gainNode.gain.setValueAtTime(1, audioCtx.currentTime);
    //isMuted = false;



}
