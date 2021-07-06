var toWav = require('audiobuffer-to-wav')

import { audioCtx, loading, eStop } from './app_core';
import { timeSpace } from './timeSpace';
import { grid } from './components/generalgrid';
import drawLayout from './ui/ui_layout';
import drawGrid from './ui/ui_grid';
import { cursor } from './components/cursor';
import { numbers } from './utils';

class Project {
    constructor(timeSpace, recordings, recordingId, trackNames, tracksGainValues, trackspanValues, tracksY, masterGainValue, masterY) {
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

const saveProject =(() => {
    if (saveWindow && projectNameNode && savebtn) {
        projectNameNode.addEventListener('keypress', save);
		savebtn.addEventListener('click', (e) =>{

			if (projectTitle.innerHTML != '') projectName = projectTitle.innerHTML;

			if(!projectName) {
				saveWindow.style.display = 'block';
		        saveWindow.style.visibility = 'visible';
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
                saveWindow.style.visibility = 'hidden';

                var trackNames = Array(grid.howMany), tracksGainValues = [], trackspanValues = [],
					tracksY = [], masterGainValue, masterY;
                if (!project === undefined) {
                    trackNames = project.trackNames;
                    tracksGainValues = project.tracksGainValues;
                    trackspanValues = project.trackspanValues;
                    tracksY = project.tracksY;
                    masterGainValue = project.masterGainValue;
                    masterY = project.masterY;

                    //Se guardan los valores de gain y pan de cada pista, comparando si estos hubiesen cambiado
                    for (let i = 0; i < grid.tracks.length; i++) {
                        if (tracksGainValues[i] != grid.tracks[i].gainNode.gainValue)
                            tracksGainValues[i] = grid.tracks[i].gainNode.gainValue;
                        if (tracksY[i] != grid.tracks[i].fader.Y)
                            tracksY[i] = grid.tracks[i].fader.Y;
                        if (trackspanValues[i] != grid.tracks[i].pannerNode.pannerValue)
                            trackspanValues[i] = grid.tracks[i].pannerNode.pannerValue;
                        if (trackNames[i] != grid.tracks[i].name)
                            trackNames[i] = grid.tracks[i].name;
                    }
                    //gain master
                    if (masterGainValue != grid.gainNode.value)
                        masterGainValue = grid.gainValue;
                    if (masterY != grid.faderY)
                        masterY = grid.faderY;
                } else {
                    for (let i = 0; i < grid.tracks.length; i++) {
                        trackNames[i] = grid.tracks[i].name;
                        tracksGainValues.push(grid.tracks[i].gainNode.gainValue);
                        tracksY.push(grid.tracks[i].fader.Y);
                        trackspanValues.push(grid.tracks[i].pannerNode.pannerValue);
                    }
                    masterGainValue = grid.gainValue;
                    masterY = grid.faderY;
                }

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

                //Se convierten los audioBuffers en wav, se convierten a su vez en blob y se envían
                for (const recording of grid.recordings) {
                    let blob = new window.Blob([new DataView(toWav(recording.audioBuffer))], {
                        type: 'audio/wav'
                    });

                    let formdata = new FormData();
                    formdata.append('audio-blob', blob);
                    formdata.append('recording-id', recording.id);
                    formdata.append('project-name', projectName);

                    $.ajax({
                        headers: {
                            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                        },
                        type: 'POST',
                        url: 'savesound',
                        data: formdata,
                        processData: false,
                        contentType: false
                    });
                }
                //Se envía el proyecto en JSON
                var projectForm = new FormData();
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
                    error: function (XMLHttpRequest, textStatus, errorThrown) {
                    }
                });
                //Se imprime el proyecto en pantalla
                projectTitle.innerHTML = projectName;
            }
        };
    }
})();


const loadProject = (() => {
    for (const projectBtn of projects) {
        projectBtn.addEventListener('dblclick', function ld(e) {
            e.stopPropagation;
            projectName = this.id;
            loadWindow.style.display = 'none';
            loadWindow.style.visibility = 'hidden';

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
                    cursor.canvas.style.left = timeSpace.space + 'px';
                    numbers.recordingId = project.recordingId;

                    drawLayout(), drawGrid(), loading();

                    //se elimina las pistas existentes si hubiesen
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
                        request.open("GET", 'loadsound/' + projectName + '/' + recording.id, true);
                        request.responseType = "arraybuffer";
                        request.onload = () => {
                            audioCtx.decodeAudioData(request.response, audioBuffer => {
                                let track = grid.tracks[recording.tracknumber];
                                track.addRecord(recording.id, recording.timeToStart,
                                    audioBuffer, recording.offset, recording.duration);
                            });
                        };
                        request.send();
                    }
                    //Se cargan los nombres de pista
                    for (let i = 0; i < grid.tracks.length; i++) {
                        grid.tracks[i].name = project.trackNames[i];
                        if (grid.tracks[i].name)
                            Names[i].innerHTML = grid.tracks[i].name;
                    }
                    //Se cargan los volúmenes de los faders
                    for (let i = 0; i < grid.tracks.length; i++) {
                        let fader = grid.tracks[i].fader;
                        grid.tracks[i].gainNode.gainValue = project.tracksGainValues[i];
                        fader.Y = project.tracksY[i];
                        fader.firstChild.nextSibling.style.top = project.tracksY[i] + 'px';
                        grid.tracks[i].gainNode.gain.setValueAtTime(grid.tracks[i].gainNode.gainValue, audioCtx.currentTime);
                    }
                    //Se carga el panorama
                    for (let f = 0; f < panButtons.length; f++) {
                        grid.tracks[f].pannerNode.pannerValue = project.trackspanValues[f];
                        panButtons[f].innerHTML = grid.tracks[f].pannerNode.pannerValue;
                        let trackPanValue = grid.tracks[f].pannerNode.pannerValue, ctxValue;
                        if (trackPanValue.toString().startsWith('L')) ctxValue = - + trackPanValue.slice(1) / 100;
                        else if (trackPanValue == 0 || trackPanValue.toString() == 'C') ctxValue = 0;
                        else if (trackPanValue.toString().startsWith('R')) ctxValue = trackPanValue.slice(1) / 100;

                        grid.tracks[f].pannerNode.pan.setValueAtTime(ctxValue, audioCtx.currentTime);
                    }
                    //Se carga el volumen master
                    grid.gainValue = project.masterGainValue;
                    grid.gainNode.gain.setValueAtTime(grid.gainValue, audioCtx.currentTime);
                    grid.faderY = project.masterY;
                    document.getElementById('master_fader').children[0].style.top = grid.faderY + 'px';
                    console.log('Project loaded successfully');
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    console.log(errorThrown);
                }
            });
        });
    }
})();

const deleteProject = (() => {
    for (let project of projects) {

        const dltConfirmation = document.getElementsByClassName('delete_confirmation')[0],
            delete_cancel = document.getElementById('delete_cancel'),
            delete_confirm = document.getElementById('delete_confirm');

        project.childNodes[1].addEventListener('click', function dlt(e) {
            const projectName = this.parentNode.id;
            dltConfirmation.classList.toggle('visible');
            delete_cancel.addEventListener('click', ()=> {
                dltConfirmation.classList.remove('visible');
            });
            delete_confirm.addEventListener('click', ()=> {
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
                    error: function (XMLHttpRequest, textStatus, errorThrown) {
                    }
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
