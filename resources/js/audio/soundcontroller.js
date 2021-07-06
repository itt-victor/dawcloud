import { timeSpace } from '../timeSpace';
import { grid } from '../components/generalgrid';
import { audioCtx } from '../app_core';
import { metronome } from '../components/metronome';

export default class SoundController {

    constructor(audioCtx) {
        this.audioCtx = audioCtx;
        this.audioBufferSources = [];
    }

    playSound() {
        for (const recording of grid.recordings) {
            const source = audioCtx.createBufferSource();
            source.buffer = recording.audioBuffer;
            source.connect(grid.tracks[recording.tracknumber].pannerNode);
            let start = Math.max(
                recording.timeToStart
                - timeSpace.time()
                + recording.offset
                + audioCtx.currentTime, 0);
            let offset = Math.max(
                timeSpace.time()
                - recording.timeToStart
                - recording.offset, 0)
                + recording.offset;
            let duration = Math.max(recording.duration - offset, 0);
            source.start(start, offset, duration);
            this.audioBufferSources.push(source);
            recording.audioBufferSource = source;
        }
    }

    stopSound() {
        for (const audioBufferSource of this.audioBufferSources)
            audioBufferSource.stop();
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
        let start = Math.max(
            recording.timeToStart
            - timeSpace.time()
            + recording.offset
            + audioCtx.currentTime, 0);
        let offset = Math.max(
            timeSpace.time()
            - recording.timeToStart
            - recording.offset, 0)
            + recording.offset;
        let duration = Math.max(recording.duration - offset, 0);
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

    metronome() {
        if (metronome) {
            let increment = timeSpace.bpm / 2;
            while (metronome) {
                const oscillator1 = audioCtx.createOscillator();

                oscillator1.type = 'sine';
                oscillator1.frequency.value = (beatNumber % 4 == 0) ? 1000 : 800;
                oscillator1.connect(audioCtx.destination);

                oscillator1.start();
                oscillator1.stop(audioCtx.currentTime + 0.1);

                increment *= 2;
            }
        }
    }
}
