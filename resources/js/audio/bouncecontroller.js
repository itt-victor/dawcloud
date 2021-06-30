var toWav = require('audiobuffer-to-wav');
import { grid } from '../components/generalgrid';
import { timeSpace } from '../timeSpace';


function exportSong() {

    if (grid.recordings.length > 0) {
        let maxLength = 0, pannerValue, ctxValue;

        for (const recording of grid.recordings) //(let i = 0; i < grid.recordings.length; i++) {
            if (maxLength < recording.audioBuffer.length + (recording.timeToStart * 48000))
                maxLength = recording.audioBuffer.length + (recording.timeToStart * 48000);

        const offlineCtx = new OfflineAudioContext({
            numberOfChannels: 2,
            length: maxLength,
            sampleRate: 48000,
        });

        let mastergain = offlineCtx.createGain();
        mastergain.connect(offlineCtx.destination);
        let pannerNodes = [];

        for (const track of grid.tracks) {
            let panner = offlineCtx.createStereoPanner();
            pannerNodes.push(panner);
            let gain = offlineCtx.createGain();
            pannerValue = track.pannerNode.pannerValue;

            if (pannerValue.startsWith('L'))
                ctxValue = - + pannerValue.slice(1) / 100;
            else if (pannerValue == 0 || pannerValue == 'C')
                ctxValue = 0;
            else if (pannerValue.startsWith('R'))
                ctxValue = pannerValue.slice(1) / 100;

			panner.pan.setValueAtTime(ctxValue, 0);
            gain.gain.setValueAtTime(track.gainNode.gainValue, 0);
            panner.connect(gain);
            gain.connect(mastergain);
        }

        for (const recording of grid.recordings) {
            const source = offlineCtx.createBufferSource();
            source.buffer = recording.audioBuffer;
            source.connect(pannerNodes[recording.tracknumber]);
            let start = Math.max(recording.timeToStart + recording.offset, 0),
			 	offset = Math.max(recording.offset, 0),                   //ESTO FALTA DE MIRARLO BIEN
			 	duration = recording.duration - recording.offset;
            source.start(start, offset, duration);
        }

        offlineCtx.startRendering().then(renderedBuffer => {
            let filename = 'project.wav'
            const a = document.createElement('a');
            let blob = new window.Blob([new DataView(toWav(renderedBuffer))], {
                type: 'audio/wav'
            });
            a.href = URL.createObjectURL(blob);
            a.download = filename;
            a.click();
            URL.revokeObjectURL(a.href);
        });
    }
}
const export_sound = document.querySelector('#export_sound');
if (export_sound) export_sound.addEventListener('click', exportSong);

export function cropAudio(recording) {

    let length = recording.audioBuffer.length - (recording.offset * 48000);
    const offlineCtx = new OfflineAudioContext({
        numberOfChannels: 2,
        length: length,
        sampleRate: 48000,
    });

    const source = offlineCtx.createBufferSource();
    source.buffer = recording.audioBuffer;
    source.connect(offlineCtx.destination);
    let offset = Math.max(recording.offset, 0);
    source.start(0, offset);

    offlineCtx.startRendering().then(renderedBuffer => {
        console.log('algo');
    });
}
