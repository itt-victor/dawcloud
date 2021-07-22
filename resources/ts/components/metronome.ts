
const button = document.querySelector('#metronome-button') as HTMLElement;
export let metronome = false;

button.addEventListener('click', function () {
    if (!metronome) {
        this.style.background = "turquoise"
        metronome = true;
    } else {
        this.style.background = ""
        metronome = false;
    }
});
