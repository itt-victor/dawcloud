const toWav = require('audiobuffer-to-wav');
import { grid } from '../app_core';


const exportSong = async () => {

    const projectTitle = document.getElementById('project-n') as HTMLElement;

    if (grid.recordings.length > 0) {
        let maxLength = 0, pannerValue, ctxValue;

        for (const recording of grid.recordings)
            if (maxLength < recording.audioBuffer.length + (recording.timeToStart * 48000))
                maxLength = recording.audioBuffer.length + (recording.timeToStart * 48000);

        const offlineCtx = new OfflineAudioContext({
            numberOfChannels: 2,
            length: maxLength,
            sampleRate: 48000,
        });

        const mastergain = offlineCtx.createGain();
        mastergain.connect(offlineCtx.destination);
        let pannerNodes = [];

        for (const track of grid.tracks) {
            const panner = offlineCtx.createStereoPanner();
            pannerNodes.push(panner);
            const gain = offlineCtx.createGain();
            pannerValue = track.pannerValue;

            pannerValue.startsWith('L')
                && (ctxValue = - + pannerValue.slice(1) / 100);
            pannerValue == '0' || pannerValue == 'C'
                && (ctxValue = 0);
            pannerValue.startsWith('R')
                && (ctxValue = parseInt(pannerValue.slice(1)) / 100);

            panner.pan.setValueAtTime(ctxValue as number, 0);
            gain.gain.setValueAtTime(track.gainValue, 0);
            panner.connect(gain);
            gain.connect(mastergain);
        }

        for (const recording of grid.recordings) {
            const source = offlineCtx.createBufferSource();
            source.buffer = recording.audioBuffer;
            source.connect(pannerNodes[recording.tracknumber]);
            const start = Math.max(recording.timeToStart + recording.offset, 0),
                offset = Math.max(recording.offset, 0),                   //ESTO FALTA DE MIRARLO BIEN
                duration = recording.duration - recording.offset;
            source.start(start, offset, duration);
        }

        let filename;
        if (projectTitle.innerHTML != '') filename = `${projectTitle.innerHTML}.wav`;
        else filename = 'project.wav';

        const renderedBuffer = await offlineCtx.startRendering()
        const a = document.createElement('a');
        const blob = new window.Blob([new DataView(toWav(renderedBuffer))], {
            type: 'audio/wav'
        });
        a.href = URL.createObjectURL(blob);
        a.download = filename;
        a.click();
        URL.revokeObjectURL(a.href);
    }
}
const export_sound = document.querySelector('#export_sound');
if (export_sound) export_sound.addEventListener('click', exportSong);
