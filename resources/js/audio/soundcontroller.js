/*import {record} from './app_core';
import {play} from './app_core';
import {stop} from './app_core';
import {startCursor} from './canvas';*/


var audioBuffer = null;
var audioBufferArray = []

export const audioCtx = new (window.AudioContext ||
    window.webkitAudioContext);

export default class SoundController {

    constructor(audioCtx) {
        this.audioCtx = audioCtx;
        this.chunks = [];
    }

    getAudioBufferArray() {
        return audioBufferArray;
    }

    /*addAudioBufferArray(audioBuffer){
        this.audioBufferArray.push(audioBuffer);
    }*/


    loopGuide() {
        const buffer = audioCtx.createBuffer(2, audioCtx.sampleRate * 6000, audioCtx.sampleRate);
        audioBufferArray.push(buffer);
    }


    loadSound(url) {
        const request = new XMLHttpRequest();
        request.open("GET", url, true);
        request.responseType = "arraybuffer";
        request.onload = function () {
            let undecodedAudio = request.response;
            console.log(undecodedAudio)
            audioCtx.decodeAudioData(undecodedAudio, (data) => {
                audioBuffer = data;
                audioBufferArray.push(audioBuffer);
            });
        };
        request.send();
        return audioBuffer;
    }

    playSound(audioBuffer, time, offset) {
        const source = audioCtx.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(audioCtx.destination);
        const latency = time + 0.05;
        source.start(time, offset);
        return source;
    }

    stopSound(source) {
        source.stop();
    }



}
