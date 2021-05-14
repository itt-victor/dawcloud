
//Seleccionar pista
function selectTrack() {
    var tracks = document.getElementsByClassName("track");
    var trackNames = document.getElementsByClassName("track_name");
    for (var i = 0; i < tracks.length; i++) {
        tracks[i].addEventListener('click', function (e) {
            for (var i = 0; i < tracks.length; i++) {
                tracks[i].removeAttribute('data-selected');
            }
            this.setAttribute('data-selected', '');
        })
    }
    /*var trck;
    for (var i = 0; i < trackNames.length; i++) {
        trackNames[i].addEventListener('click', function (e) {
            for (var i = 0; i < trackNames.length; i++) {
              trck = trackNames[i].parentNode.parentNode.lastChild.previousSibling//.nextSibling;
                //trck[i].removeAttribute('data-selected');
                console.log(trck, trackNames);
            }

            //trck.setAttribute('data-selected', '');
        })
    }*/
}

selectTrack();

function changeTrackName() {
    var tracksNames = document.getElementsByClassName('select');
    for (var i = 0; i < tracksNames.length; i++) {
        tracksNames[i].addEventListener('dblclick', function dbl(e) {
            var esto = this.nextSibling;
            var estoOtro = this;
            estoOtro.style.display = 'none';
            estoOtro.style.visibility = 'invisible';
            esto.style.display = 'block';
            esto.style.visibility = 'visible';
            window.addEventListener('click', function (a) {
                if (a.target.contains(e.target)) {
                    esto.style.display = 'none';
                    esto.style.visibility = 'invisible';
                    estoOtro.style.display = 'block';
                    estoOtro.style.visibility = 'visible';
                }
            });
            esto.addEventListener('keyup', function (e) {
                if (e.keyCode === 13) {
                    e.preventDefault();
                    estoOtro.innerHTML = esto.value;
                    esto.style.display = 'none';
                    esto.style.visibility = 'invisible';
                    estoOtro.style.display = 'block';
                    estoOtro.style.visibility = 'visible';
                }
            });
        });
    }
}

changeTrackName();
