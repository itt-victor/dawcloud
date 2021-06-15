var toWav = require('audiobuffer-to-wav');
import { grid } from '../components/generalgrid';
import { timeSpace } from '../timeSpace';


function exportSong() {

    if (grid.recordings.length > 0) {
        let maxLength = 0;
        let pannerValue;
        let ctxValue;

        for (let i = 0; i < grid.recordings.length; i++) {
            if (maxLength < (grid.recordings[i].audioBuffer.length
                + (grid.recordings[i].timeToStart * 48000))) {
                maxLength = grid.recordings[i].audioBuffer.length
                    + (grid.recordings[i].timeToStart * 48000);
            };
        }

        const offlineCtx = new OfflineAudioContext({
            numberOfChannels: 2,
            length: maxLength,
            sampleRate: 48000,
        });

        let mastergain = offlineCtx.createGain();
        mastergain.connect(offlineCtx.destination);
        let pannerNodes = [];

        for (let i = 0; i < grid.tracks.length; i++) {
            let panner = offlineCtx.createStereoPanner();
            pannerNodes.push(panner);
            let gain = offlineCtx.createGain();
            pannerValue = grid.tracks[i].pannerNode.pannerValue;

            if (pannerValue.startsWith('L')) {
                ctxValue = - + pannerValue.slice(1) / 100;
                panner.pan.setValueAtTime(ctxValue, 0);
            }
            else if (pannerValue == 0 || pannerValue == 'C') {
                ctxValue = 0;
                panner.pan.setValueAtTime(ctxValue, 0);
            }
            else if (pannerValue.startsWith('R')) {
                ctxValue = pannerValue.slice(1) / 100;
                panner.pan.setValueAtTime(ctxValue, 0);
            }
            gain.gain.setValueAtTime(grid.tracks[i].gainNode.gainValue, 0);
            panner.connect(gain);
            gain.connect(mastergain);
        }

        for (let h = 0; h < grid.recordings.length; h++) {
            const source = offlineCtx.createBufferSource();
            source.buffer = grid.recordings[h].audioBuffer;
            source.connect(pannerNodes[grid.recordings[h].tracknumber]);
            let start = Math.max(grid.recordings[h].timeToStart + grid.recordings[h].offset, 0);
			let offset = Math.max(grid.recordings[h].offset, 0);                    //ESTO FALTA DE MIRARLO BIEN
			let duration = grid.recordings[h].duration - grid.recordings[h].offset;
            source.start(start, offset, duration);
        }

        offlineCtx.startRendering().then(function (renderedBuffer) {
            let filename = 'project.wav'
            const a = document.createElement('a');
            var blob = new window.Blob([new DataView(toWav(renderedBuffer))], {
                type: 'audio/wav'
            });
            a.href = URL.createObjectURL(blob);
            a.download = filename;
            a.click();
            URL.revokeObjectURL(a.href);
        });
    }
}

let export_sound = document.getElementById('export_sound');
if (export_sound) {
    export_sound.addEventListener('click', exportSong);
}

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

    offlineCtx.startRendering().then(function (renderedBuffer) {
        console.log('algo');
    });
}
