import { timeSpace } from '../timeSpace';

export const snap = {
    setup : timeSpace.zoom * timeSpace.compas * timeSpace.bpm * timeSpace.snap,
    toggle : false
};

const button = document.querySelector('#snap-button') as HTMLButtonElement,
      selectSnap = document.querySelector('#snap_ratio') as HTMLButtonElement;

//let snap = false;
selectSnap.onchange = () => timeSpace.snap = parseFloat(selectSnap.value);


button.addEventListener('click', function () {
    if (!snap.toggle) {
        this.style.background = "turquoise"
        snap.toggle = true;
    } else {
        this.style.background = ""
        snap.toggle = false;
    }
});
