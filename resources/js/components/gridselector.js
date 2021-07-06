
function onMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: Math.round(evt.clientX - rect.left),
        y: Math.round(evt.clientY - rect.top)
    };
}
const gridSelector = (() => {
    const gridSelector = document.querySelector('#grid-selector');
    const ctx = gridSelector.getContext('2d');
    let height = 510;
    let width = 20;
    gridSelector.width = width;
    gridSelector.height = height;
    ctx.fillStyle = /*'black';//*/'rgb(0, 0, 0, 0.4)';


    ctx.fillRect(0, 30, width, height);
})();
