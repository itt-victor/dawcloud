
/*export function moveTrack(){}
function drawLineToContext(ctx, peaks, absmax, halfH, offsetY, start, end) {
    if (!ctx) {
        return;
    }

    const length = peaks.length / 2;
    const first = Math.round(length * this.start);

    // use one more peak value to make sure we join peaks at ends -- unless,
    // of course, this is the last canvas
    const last = Math.round(length * this.end) + 1;

    const canvasStart = first;
    const canvasEnd = last;
    const scale = this.wave.width / (canvasEnd - canvasStart - 1);

    // optimization
    const halfOffset = halfH + offsetY;
    const absmaxHalf = absmax / halfH;

    ctx.beginPath();
    ctx.moveTo((canvasStart - first) * scale, halfOffset);

    ctx.lineTo(
        (canvasStart - first) * scale,
        halfOffset - Math.round((peaks[2 * canvasStart] || 0) / absmaxHalf)
    );

    let i, peak, h;
    for (i = canvasStart; i < canvasEnd; i++) {
        peak = peaks[2 * i] || 0;
        h = Math.round(peak / absmaxHalf);
        ctx.lineTo((i - first) * scale + this.halfPixel, halfOffset - h);
    }

    // draw the bottom edge going backwards, to make a single
    // closed hull to fill
    let j = canvasEnd - 1;
    for (j; j >= canvasStart; j--) {
        peak = peaks[2 * j + 1] || 0;
        h = Math.round(peak / absmaxHalf);
        ctx.lineTo((j - first) * scale + this.halfPixel, halfOffset - h);
    }

    ctx.lineTo(
        (canvasStart - first) * scale,
        halfOffset -
            Math.round((peaks[2 * canvasStart + 1] || 0) / absmaxHalf)
    );

    ctx.closePath();
    ctx.fill();
}*/

/*

// MUSIC DISPLAY
function displayBuffer(audioBuffer) {
    var canvasWidth = 1000,  canvasHeight = 80 ;

    var drawLines = 500;
     var leftChannel = audioBuffer.getChannelData(0); // Float32Array describing left channel
     var lineOpacity = canvasWidth / leftChannel.length  ;
     canvasCtx.save();
     canvasCtx.fillStyle = '#080808' ;
     canvasCtx.fillRect(0,0,canvasWidth,canvasHeight );
     canvasCtx.strokeStyle = '#46a0ba';
     canvasCtx.globalCompositeOperation = 'lighter';
     canvasCtx.translate(0,canvasHeight / 2);
     //context.globalAlpha = 0.6 ; // lineOpacity ;
     canvasCtx.lineWidth=1;
     var totallength = leftChannel.length;
     var eachBlock = Math.floor(totallength / drawLines);
     var lineGap = (canvasWidth/drawLines);

    context.beginPath();
     for(var i=0;i<=drawLines;i++){
        var audioBuffKey = Math.floor(eachBlock * i);
         var x = i*lineGap;
         var y = leftChannel[audioBuffKey] * canvasHeight / 2;
         canvasCtx.moveTo( x, y );
         canvasCtx.lineTo( x, (y*-1) );
     }
     canvasCtx.stroke();
     canvasCtx.restore();
  }

  function createCanvas ( w, h ) {
      var newCanvas = document.createElement('canvas');
      newCanvas.width  = w;     newCanvas.height = h;
      return newCanvas;
  };*/
