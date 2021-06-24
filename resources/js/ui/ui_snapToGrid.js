import { timeSpace } from '../timeSpace';

export let snap = {
    setup : timeSpace.zoom * timeSpace.compas * timeSpace.bpm * timeSpace.snap,
    toggle : false
};

const button = document.querySelector('#snap-button');
const selectSnap = document.querySelector('#snap_ratio');

//let snap = false;
selectSnap.onchange = () => {
    timeSpace.snap = parseFloat(selectSnap.value);
    snap.setup = timeSpace.zoom * timeSpace.compas * timeSpace.bpm * timeSpace.snap;
}

button.addEventListener('click', function () {
    if (!snap.toggle) {
        this.style.background = "turquoise"
        snap.toggle = true;
    } else {
        this.style.background = ""
        snap.toggle = false;
    }
});

