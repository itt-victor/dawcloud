import { timeSpace } from '../timeSpace';
import { grid } from '../components/generalgrid';

//Esto aquí mismo ya que se se pierden en cada play
export var audioBufferSources = [];

export const audioCtx = new (window.AudioContext ||
    window.webkitAudioContext);

export default class SoundController {

    constructor(audioCtx) {
        this.audioCtx = audioCtx;
    }

    getAudioBuffers() {
        return audioBuffers;
    }

    /*loopGuide() {   //HACE FALTA????
        const buffer = audioCtx.createBuffer(2, audioCtx.sampleRate * 6000, audioCtx.sampleRate);
        //audioBuffers.push(buffer);
        return buffer;
    }*/

    loadSound(url, trcknr) {
        //let trcknr = document.querySelector('[data-selected] > canvas').id;
        //esto para cuando no cargues audio a lo feo, de momento pasa por parámetro, o igual en la funcion a crear.
        const request = new XMLHttpRequest();
        request.open("GET", url, true);
        request.responseType = "arraybuffer";
        request.onload = function () {
            let undecodedAudio = request.response;
            audioCtx.decodeAudioData(undecodedAudio, (data) => {
                var audioBuffer = data;
                grid.tracks[trcknr].addRecord(0, 0, audioBuffer);//creo recording
            });
        };
        request.send();
    }

    playSound(tracks) {
        for (var i = 0; i < tracks.length; i++) {
            let recordings = tracks[i].recordings;
            for (var h = 0; h < recordings.length; h++) {
                const source = audioCtx.createBufferSource();
                source.buffer = recordings[h].audioBuffer;
                source.connect(audioCtx.destination);
                var start = recordings[h].timeToStart - timeSpace.timeAtPause + audioCtx.currentTime;
                var offset = timeSpace.timeAtPause - recordings[h].timeToStart;
                if (start <= 0) {
                    start = 0;
                }
                if (offset <= 0) {
                    offset = 0;
                }
                source.start(start, offset );
                audioBufferSources.push(source);
                recordings[h].audioBufferSource = source;
            }
        }
    }

    stopSound(sources) {
        for (var i = 0; i < sources.length; i++) {
            sources[i].stop(0);
        }
        timeSpace.timeAtPause = timeSpace.pxAtPause / 5;
        audioBufferSources = [];
    }

    playWhileDragging(recording) {
        recording.audioBufferSource.stop()
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
        source.start(start, offset );
        recording.audioBufferSource = source;
        audioBufferSources.push(source);
    }

}
