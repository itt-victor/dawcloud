import { timeSpace } from '../timeSpace';
import { grid, audioCtx } from '../app_core';
import Recording from '../components/recording';
import Track from '../components/track';
import { metronome } from '../components/metronome';
import { numbers } from '../utils';

export default class SoundController {

    audioBufferSources: AudioBufferSourceNode[] = [];

    async playSound() {
        const play = async (recording: Recording) => {
            const source = audioCtx.createBufferSource();
            source.buffer = recording.audioBuffer;
            source.connect(grid.tracks[recording.tracknumber].pannerNode);
            const start = Math.max(
                recording.timeToStart
                - timeSpace.time()
                + recording.offset
                + audioCtx.currentTime, 0);
            const offset = Math.max(
                timeSpace.time()
                - recording.timeToStart
                - recording.offset, 0)
                + recording.offset;
            const duration = Math.max(recording.duration - offset, 0);
            source.start(start, offset, duration);
            this.audioBufferSources.push(source);
            recording.audioBufferSource = source;
        }
        for await (const recording of grid.recordings) play(recording);
    }

    stopSound() {
        for (const audioBufferSource of this.audioBufferSources)
            audioBufferSource.stop();
        this.audioBufferSources = [];
    }

    stopSingleSound(recording: Recording) {
        recording.audioBufferSource?.stop();
    }

    playWhileDragging(recording: Recording) {
        recording.audioBufferSource?.stop();
        const source = audioCtx.createBufferSource();
        source.buffer = recording.audioBuffer;
        source.connect(grid.tracks[recording.tracknumber].pannerNode);
        const start = Math.max(
            recording.timeToStart
            - timeSpace.time()
            + recording.offset
            + audioCtx.currentTime, 0);
        const offset = Math.max(
            timeSpace.time()
            - recording.timeToStart
            - recording.offset, 0)
            + recording.offset;
        const duration = Math.max(recording.duration - offset, 0);
        source.start(start, offset, duration);
        recording.audioBufferSource = source;
        this.audioBufferSources.push(source);
    }

    mute(gainNode: GainNode) {
        gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
    }

    solo(track: Track) {
        track.gainNode.gain.setValueAtTime(track.gainValue, audioCtx.currentTime);
    }

    metronome() {
        let interval;
        if (metronome) {
            let increment = 1000 / ((120 / timeSpace.bpm) / 60);
            let barType = (timeSpace.compas === 2) ? 4 : 3;
            let beatNumber = 1;

            const measure = () => {
                const oscillator = audioCtx.createOscillator();
                oscillator.type = 'sine';
                oscillator.connect(audioCtx.destination);
                oscillator.frequency.value = (beatNumber % barType == 0) ? 1000 : 800;
                oscillator.start(audioCtx.currentTime);
                oscillator.stop(1);
                beatNumber++;
            }

            interval = setInterval(measure, increment);

        } else clearInterval(interval);
    }
}
