/*import {record} from './app_core';
import {play} from './app_core';
import {stop} from './app_core';
import {startCursor} from './canvas';*/

import { timeSpace } from '../timeSpace';
import { grid } from '../components/generalgrid';

export var audioBufferSources = {
    length: 0,
    add: function add(elem) {
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
        //audioBuffers.add(buffer);
    }

    loadSound(url, trcknr) {
        //let trcknr = document.querySelector('[data-selected] > canvas').id;

        const request = new XMLHttpRequest();
        request.open("GET", url, true);
        request.responseType = "arraybuffer";
        request.onload = function () {
            let undecodedAudio = request.response;
            audioCtx.decodeAudioData(undecodedAudio, (data) => {
                var audioBuffer = data;
                //audioBuffers.add(audioBuffer);
                grid.tracks[trcknr].addRecord(0, 0, audioBuffer);//creo recording
            });
        };
        request.send();
    }

    playSound(tracks, offset) {
        audioCtx.resume();
        for (var i = 0; i < tracks.length; i++) {
            let recordings = tracks[i].recordings;
            for (var h = 0; h < recordings.length; h++) {
                const source = audioCtx.createBufferSource();
                source.buffer = recordings[h].audioBuffer;
                source.connect(audioCtx.destination);
                const latency = recordings[h].timeToStart + 0.03;
                source.start(latency, offset);
                audioBufferSources.add(source);
                console.log(recordings[h].audioBuffer);
            }
        }
    }


    stopSound(sources) {
        for (var i = 0; i < sources.length; i++) {
            sources[i].stop();
        }
        //audioBufferSources = [];   vaciarlo??????
        audioCtx.suspend();
    }



}
