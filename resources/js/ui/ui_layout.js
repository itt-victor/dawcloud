

const layout = document.querySelector('#layout');
layout.height = 30;
layout.width = 1000;
var layoutCtx = layout.getContext('2d');
layoutCtx.strokeStyle = '#7a2332';
layoutCtx.lineWidth = '10px';
let text = 1;

for (var i = 0; i < 1000; i+= 20) {
    layoutCtx.beginPath();
    layoutCtx.moveTo(i, 30);
    layoutCtx.lineTo(i, 22);
    layoutCtx.closePath();
    layoutCtx.stroke();
    if (text < 10){
        layoutCtx.strokeText(text ,i-2, 18)
    } else {
        layoutCtx.strokeText(text ,i-6, 18)
    }
    text += 2;
}

for (var i = 10; i < 1000; i+= 20) {
    layoutCtx.beginPath();
    layoutCtx.moveTo(i, 30);
    layoutCtx.lineTo(i, 27);
    layoutCtx.closePath();
    layoutCtx.stroke();
}
