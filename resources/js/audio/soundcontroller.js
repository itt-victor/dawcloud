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
            var start = Math.max(
                grid.recordings[h].timeToStart
                - timeSpace.time()
                + grid.recordings[h].offset
                + audioCtx.currentTime, 0);
            var offset = Math.max(
                timeSpace.time()
                - grid.recordings[h].timeToStart
                - grid.recordings[h].offset, 0)
                + grid.recordings[h].offset;
            var duration = Math.max(grid.recordings[h].duration - offset, 0);
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
        var start = Math.max(
            recording.timeToStart
            - timeSpace.time()
            + recording.offset
            + audioCtx.currentTime, 0);
        var offset = Math.max(
            timeSpace.time()
            - recording.timeToStart
            - recording.offset, 0)
            + recording.offset;
        var duration = Math.max(recording.duration - offset, 0);
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

}
