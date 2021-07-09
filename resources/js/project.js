var toWav = require('audiobuffer-to-wav')

import { audioCtx, loading, eStop } from './app_core';
import { timeSpace } from './timeSpace';
import { grid } from './components/generalgrid';
import drawLayout from './ui/ui_layout';
import drawGrid from './ui/ui_grid';
import { cursor } from './components/cursor';
import { numbers } from './utils';

class Project {
    constructor(timeSpace, recordings, recordingId, trackNames,
        tracksGainValues, trackspanValues, tracksY, masterGainValue, masterY) {
        this.timeSpace = timeSpace;
        this.recordings = recordings;
        this.recordingId = recordingId;
        this.trackNames = trackNames;
        this.tracksGainValues = tracksGainValues;
        this.trackspanValues = trackspanValues;
        this.tracksY = tracksY;
        this.masterGainValue = masterGainValue;
        this.masterY = masterY;
    }
}

const loadbtn = document.getElementById('load_project'),
    savebtn = document.getElementById('save_project'),
    saveAsBtn = document.getElementById('save_project_as'),
    bpmButton = document.getElementById('bpm_button'),
    metricButton = document.getElementById('metric_button'),
    Names = document.querySelectorAll('.select'),
    closeProjects = document.querySelector('#projects-close'),
    closeSave = document.querySelector('#save-close'),
    saveWindow = document.getElementById('save_dialogue'),
    loadWindow = document.getElementById('load_dialogue'),
    panButtons = document.getElementsByClassName('panner'),
    projects = document.getElementsByClassName('projects'),
    projectNameNode = document.getElementById('project_name'),
    projectTitle = document.getElementById('project-n');

var project;
var projectName;

//STORE DATA IN SESSION
export const sessionProgress = () => {
    fetch('new-project', {
        method: 'POST',
        headers: {
            'X-CSRF-TOKEN': document.head.querySelector('[name="csrf-token"]').content
        },
    });
};

//STORE NEW AUDIO FILES
export const storeFile = recording => {
    const blob = new window.Blob([new DataView(toWav(recording.audioBuffer))], { type: 'audio/wav' });
    let formData = new FormData();
    formData.append('audio-file', blob);
    formData.append('recording_id', recording.id);
    formData.append('filename', recording.filename);
    if (projectName) formData.append('project_name', projectName);
    fetch('savesound', {
        method: 'POST',
        headers: { 'X-CSRF-TOKEN': document.head.querySelector('[name="csrf-token"]').content },
        body: formData
    })
        .then( response => response.text())
        .then( data => !recording.filename && (recording.filename = data));
};

//SAVE PROJECT
(() => {
    if (saveWindow && projectNameNode && savebtn) {
        projectNameNode.addEventListener('keypress', save);
        savebtn.addEventListener('click', (e) => {

            if (projectTitle.innerHTML != '') projectName = projectTitle.innerHTML;

            if (!projectName) {
                saveWindow.style.display = 'block';
                projectNameNode.focus();
            } else {
                document.querySelector('.dropdown-menu').classList.remove('show');
                save(e);
            }
        });

        function save(e) {
            if (e.key === 'Enter' || e.type == 'click') {
                e.stopImmediatePropagation();
                e.preventDefault();

                if (!projectName) projectName = e.target.value;
                saveWindow.style.display = 'none';

                let trackNames = Array(grid.howMany), tracksGainValues = [], trackspanValues = [],
                    tracksY = [], masterGainValue, masterY;

                for (const [i, track] of grid.tracks.entries()) {
                    trackNames[i] = track.name;
                    tracksGainValues.push(track.gainNode.gainValue);
                    tracksY.push(track.fader.Y);
                    trackspanValues.push(track.pannerNode.pannerValue);
                }
                masterGainValue = grid.gainValue;
                masterY = grid.faderY;

                //Se envían los audios al servidor
                for (const recording of grid.recordings) storeFile(recording);

                //creo objeto proyecto
                if (project === undefined)
                    project = new Project(timeSpace, grid.recordings, numbers.recordingId, trackNames,
                        tracksGainValues, trackspanValues, tracksY, masterGainValue, masterY);
                else {
                    project.timeSpace = timeSpace;
                    project.recordings = grid.recordings;
                    project.recordingId = numbers.recordingId;
                    project.trackNames = trackNames;
                    project.tracksGainValues = tracksGainValues;
                    project.trackspanValues = trackspanValues;
                    project.tracksY = tracksY;
                    project.masterGainValue = masterGainValue;
                    project.masterY = masterY;
                }

                //Se envía el proyecto en JSON
                let projectForm = new FormData();
                projectForm.append('project-name', projectName);
                projectForm.append('project', JSON.stringify(project));
                $.ajax({
                    headers: {
                        'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                    },
                    type: 'POST',
                    url: 'saveproject',
                    data: projectForm,
                    processData: false,
                    contentType: false,
                    success: function (data) {
                        console.log('Project saved successfully');
                    },
                    error: () => console.log('There has been an error!')
                });
                //Se imprime el proyecto en pantalla
                projectTitle.innerHTML = projectName;
            }
        };
    }
})();


//LOAD PROJECT
(() => {
    for (const projectBtn of projects) {
        projectBtn.addEventListener('dblclick', function ld(e) {
            e.stopPropagation;
            projectName = this.id;
            loadWindow.style.display = 'none';

            eStop();

            $.ajax({
                headers: {
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                },
                type: 'GET',
                url: 'loadproject/' + projectName,
                dataType: 'json',
                success: function (response, request) {
                    project = response;

                    timeSpace.space = project.timeSpace.space;
                    timeSpace.zoom = project.timeSpace.zoom;
                    timeSpace.bpm = project.timeSpace.bpm;
                    timeSpace.compas = project.timeSpace.compas;
                    bpmButton.innerHTML = (120 / timeSpace.bpm) + '  bpm';
                    metricButton.innerHTML = (timeSpace.compas == 2) ? '4/4' : '3/4';

                    cursor.canvas.style.left = timeSpace.space + 'px';
                    numbers.recordingId = project.recordingId;

                    drawLayout(); drawGrid(); loading();

                    //se eliminan las pistas existentes si hubiesen
                    grid.recordings.forEach((recording) => {
                        recording.canvasCtx.clearRect(0, 0, 4000, 70);
                        recording.deleteRecording();
                        delete recording.audioBuffer;
                    });
                    grid.recordings = [];

                    //Se vacían los nombres de pista
                    grid.tracks.forEach(track => {
                        delete track.name;
                    });

                    //Se imprime el proyecto en pantalla
                    projectTitle.innerHTML = projectName;

                    //Se cargan los audios
                    for (const recording of project.recordings) {

                        const request = new XMLHttpRequest();
                        request.open("GET", 'loadsound/' + recording.filename, true);
                        request.responseType = "arraybuffer";
                        request.onload = () => {
                            audioCtx.decodeAudioData(request.response, audioBuffer => {
                                let track = grid.tracks[recording.tracknumber];
                                let newrecording = track.addRecord(recording.id, recording.timeToStart,
                                    audioBuffer, recording.offset, recording.duration);
                                    newrecording.filename = recording.filename;
                            });
                        };
                        request.send();
                    }

                    //Se cargan los nombres de pista
                    for (const [i, track] of grid.tracks.entries()) {
                        track.name = project.trackNames[i];
                        if (track.name) Names[i].innerHTML = track.name;
                    }
                    //Se cargan los volúmenes de los faders
                    for (const [i, track] of grid.tracks.entries()) {
                        let fader = track.fader;
                        track.gainNode.gainValue = project.tracksGainValues[i];
                        fader.Y = project.tracksY[i];
                        fader.querySelector('a').style.top = project.tracksY[i] + 'px';
                        track.gainNode.gain.setValueAtTime(track.gainNode.gainValue, audioCtx.currentTime);
                    }
                    //Se carga el panorama
                    for (const [i, track] of grid.tracks.entries()) {
                        track.pannerNode.pannerValue = project.trackspanValues[i];
                        panButtons[i].innerHTML = track.pannerNode.pannerValue;
                        let trackPanValue = track.pannerNode.pannerValue, ctxValue;
                        trackPanValue.toString().startsWith('L')
                            && (ctxValue = - + trackPanValue.slice(1) / 100);
                        trackPanValue == 0 || trackPanValue.toString() == 'C'
                            && (ctxValue = 0);
                        trackPanValue.toString().startsWith('R')
                            && (ctxValue = trackPanValue.slice(1) / 100);

                        track.pannerNode.pan.setValueAtTime(ctxValue, audioCtx.currentTime);
                    }
                    //Se carga el volumen master
                    grid.gainValue = project.masterGainValue;
                    grid.gainNode.gain.setValueAtTime(grid.gainValue, audioCtx.currentTime);
                    grid.faderY = project.masterY;
                    document.querySelector('#master_fader > a').style.top = grid.faderY + 'px';
                    console.log('Project loaded successfully');
                },
                error: () => console.log('There has been an error!')
            });
        });
    }
})();

//DELETE PROJECT
(() => {
    for (let project of projects) {

        const dltConfirmation = document.getElementsByClassName('delete_confirmation')[0],
            delete_cancel = document.getElementById('delete_cancel'),
            delete_confirm = document.getElementById('delete_confirm');

        project.childNodes[1].addEventListener('click', function dlt(e) {
            const projectName = this.parentNode.id;
            dltConfirmation.classList.toggle('visible');
            delete_cancel.addEventListener('click', () => {
                dltConfirmation.classList.remove('visible');
            });
            delete_confirm.addEventListener('click', () => {
                let form = new FormData();
                form.append('project', projectName);
                $.ajax({
                    headers: {
                        'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                    },
                    type: 'POST',
                    url: 'delete',
                    data: form,
                    processData: false,
                    contentType: false,
                    success: data => {
                        console.log('Project deleted successfully');
                        dltConfirmation.classList.remove('visible');
                        document.getElementById(projectName).remove();
                    },
                    error: () => console.log('There has been an error!')
                });
            });
        });
    }
})();

if (loadbtn) {
    loadbtn.addEventListener('click', () => loadWindow.style.display = 'block');
    closeProjects.addEventListener('click', () => loadWindow.style.display = 'none');
}

if (saveAsBtn) {
    saveAsBtn.addEventListener('click', () => {
        saveWindow.style.display = 'block';
        projectNameNode.focus();
    });
    closeSave.addEventListener('click', () => saveWindow.style.display = 'none');
}
