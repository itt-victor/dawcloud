import { timeSpace } from '../timeSpace';
import { grid } from '../components/generalgrid';
import { audioCtx } from '../app_core';


export default class SoundController {

    constructor(audioCtx) {
        this.audioCtx = audioCtx;
        this.audioBufferSources = [];
    }

    playSound() {
        for (var h = 0; h < grid.recordings.length; h++) {
            const source = audioCtx.createBufferSource();
            source.buffer = grid.recordings[h].audioBuffer;
            source.connect(grid.tracks[grid.recordings[h].tracknumber].pannerNode);
            var start = Math.max((grid.recordings[h].timeToStart - timeSpace.time() + audioCtx.currentTime), 0);
            var offset = Math.max((timeSpace.time() - grid.recordings[h].timeToStart + grid.recordings[h].offset), 0);
            var duration;
            if (grid.recordings[h].duration){ duration = grid.recordings[h].duration; }
            source.start(start, offset, duration);
            this.audioBufferSources.push(source);
            grid.recordings[h].audioBufferSource = source;
        }
    }

    stopSound() {
        for (var i = 0; i < this.audioBufferSources.length; i++) {
            this.audioBufferSources[i].stop();
        }
        this.audioBufferSources = [];
    }

    stopSingleSound(recording) {
        recording.audioBufferSource.stop();
    }

    playWhileDragging(recording) {
        recording.audioBufferSource.stop();
        const source = audioCtx.createBufferSource();
        source.buffer = recording.audioBuffer;
        source.connect(grid.tracks[recording.tracknumber].pannerNode);
        var start = Math.max((recording.timeToStart - timeSpace.time() + audioCtx.currentTime), 0);
        var offset = Math.max((timeSpace.time() - recording.timeToStart), 0);
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
