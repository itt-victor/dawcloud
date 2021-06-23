
const button = document.querySelector('#snap-button');
const selectSnap = document.querySelector('#snap_ratio');
let snap = false;

button.addEventListener('click', function () {
    if (!snap) {
        this.style.background = "turquoise"
        snapToGrid()
        snap = true;
    } else {
        this.style.background = ""
        snap = false;
    }
});


function snapToGrid() {

}
