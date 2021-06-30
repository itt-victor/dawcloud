
function selectedRecording(recording, zoom) {
	let width = recording.audioBuffer.duration * (zoom + 0.15);
	let height = 58;
	let offCanvas = new OffscreenCanvas(width, height);
	let canvasCtx = offCanvas.getContext('2d');
	canvasCtx.fillStyle = '#20453a';
	canvasCtx.beginPath();
	canvasCtx.moveTo(0, 0);
	canvasCtx.lineTo(width, 0);
	canvasCtx.lineTo(width, 58);
	canvasCtx.lineTo(0, 58);
	canvasCtx.fill();
	canvasCtx.closePath();
	canvasCtx.strokeStyle = '#380166';
	canvasCtx.strokeRect(0, 0, width -2, height);

	if (recording.audioBuffer.numberOfChannels === 2) {  //si es estereo..
		var data = recording.audioBuffer.getChannelData(0);
		var step = Math.ceil(data.length / width);
		var amp = height / 4;
		for (var i = 0; i < width; i++) {
			var min = 1.0;
			var max = -1.0;
			for (var j = 0; j < step; j++) {
				var datum = data[(i * step) + j];
				if (datum < min)
					min = datum;
				if (datum > max)
					max = datum;
			}
			canvasCtx.fillStyle = '#2ed9a5';
			canvasCtx.fillRect(i, (1 + min) * amp, 1, Math.max(1, (max - min) * amp));
		}
		var data = recording.audioBuffer.getChannelData(1);
		var step = Math.ceil(data.length / width);
		var amp = height / 4;
		for (var i = 0; i < width; i++) {
			var min = 1.0;
			var max = -1.0;
			for (var j = 0; j < step; j++) {
				var datum = data[(i * step) + j];
				if (datum < min)
					min = datum;
				if (datum > max)
					max = datum;
			}
			canvasCtx.fillStyle = '#2ed9a5';
			canvasCtx.fillRect(i, (1 + min) * amp + height / 2, 1, Math.max(1, (max - min) * amp));
		}
	} else if (recording.audioBuffer.numberOfChannels === 1) {  // si es mono..
		var data = recording.audioBuffer.getChannelData(0);
		var step = Math.ceil(data.length / width);
		var amp = height / 2;
		for (var i = 0; i < width; i++) {
			var min = 1.0;
			var max = -1.0;
			for (var j = 0; j < step; j++) {
				var datum = data[(i * step) + j];
				if (datum < min)
					min = datum;
				if (datum > max)
					max = datum;
			}
			canvasCtx.fillStyle = '#2ed9a5';
			canvasCtx.fillRect(i, (1 + min) * amp, 1, Math.max(1, (max - min) * amp));
		}
	}
	return offCanvas;
}
