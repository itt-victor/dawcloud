
//Seleccionar pista
function selectTrack() {
    var tracks = document.getElementsByClassName("track");
    var trackNames = document.getElementsByClassName("track_name");
    for (var i = 0; i < tracks.length; i++) {
        tracks[i].addEventListener('mousedown', function (e) {
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
    var prr = document.getElementsByClassName('input');
    for (var i = 0; i < prr.length; i++){
        prr[i].style.display = 'none';
        prr[i].style.visibility = 'hidden';
    }
    for (var i = 0; i < tracksNames.length; i++) {
        tracksNames[i].addEventListener('dblclick', function dbl(e) {
            var box = this.nextSibling;
            var text = this;
            text.style.display = 'none';
            text.style.visibility = 'hidden';
            box.style.display = 'block';
            box.style.visibility = 'visible';
            window.addEventListener('click', function (a) {
                if (a.target.contains(e.target)) {
                    box.style.display = 'none';
                    box.style.visibility = 'hidden';
                    text.style.display = 'block';
                    text.style.visibility = 'visible';
                }
            });
            box.addEventListener('keyup', function (e) {
                if (e.keyCode === 13) {
                    e.preventDefault();
                    text.innerHTML = box.value;
                    box.style.display = 'none';
                    box.style.visibility = 'hidden';
                    text.style.display = 'block';
                    text.style.visibility = 'visible';
                }
            });
        });
    }
}

changeTrackName();
