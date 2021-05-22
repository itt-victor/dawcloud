import { timeSpace } from './timeSpace';
import { grid } from './components/generalgrid';
import { Grid } from './components/generalgrid';

class Project {
    constructor(timeSpace, recordings, tracksGainValues) {
        this.recordings = recordings;
        this.tracksGainValues = tracksGainValues;
        this.timeSpace = timeSpace;
    }
}

var project;
function saveProject() {
    let tracksGainValues = [];
    for (let i = 0; i < grid.tracks.length; i++){
        tracksGainValues.push(grid.tracks[i].gainNode.gainValue);
    }
    project = new Project(timeSpace, grid.recordings, tracksGainValues);
}
//setTimeout(function() {saveProject();}, 5000);

function loadProject(project){
    timeSpace = project.timeSpace;
    var newGrid = new Grid([], project.recordings);
    grid = newGrid;

}
