/*import {record} from './app_core';
import {play} from './app_core';
import {stop} from './app_core';
import {startCursor} from './canvas';*/


//var audioBuffer;
export var audioBuffers = [];/*{
    length: 0,
    add: function add(elem){
        [].push.call(this, elem);
    }
};*/

export var audioBufferSources = {
    length: 0,
    add: function add(elem){
        [].push.call(this, elem);
    }
};

var audioBuffersKeys = 0;

export const audioCtx = new (window.AudioContext ||
    window.webkitAudioContext);

export default class SoundController {

    constructor(audioCtx) {
        this.audioCtx = audioCtx;
        this.chunks = [];

    }

    getAudioBuffers() {
        return audioBuffers;
    }

    loopGuide() {
        const buffer = audioCtx.createBuffer(2, audioCtx.sampleRate * 6000, audioCtx.sampleRate);
        audioBuffers.push(buffer);
        console.log(audioBuffers)
    }

    loadSound(url) {
        const request = new XMLHttpRequest();
        request.open("GET", url, true);
        request.responseType = "arraybuffer";
        request.onload = function () {
            let undecodedAudio = request.response;
            audioCtx.decodeAudioData(undecodedAudio, (data) => {
                var audioBuffer = data;
                audioBuffersKeys++;
                audioBuffers.push(audioBuffer);
            });
        };
        request.send();
    }

    playSound(audioBuffers, time, offset) {//debería de sacarse un array de records que esté en el objeto de track o trackgrid, de donse se saca estos 3 parametros
      for (var i = 0; i < audioBuffers.length; i++) {
          const source = audioCtx.createBufferSource();
          source.buffer = audioBuffer[i];
          source.connect(audioCtx.destination);
          const latency = time + 0.05;
          source.start(latency, offset);
          audioBufferSources.add(source);
      }
    }

    stopSound(sources) {
        for (var i = 0; i < sources.length; i++){
            sources[i].stop();
        }
        //audioBufferSources = [];   vaciarlo??????
    }



}
