var percentage = document.getElementsByClassName('progress__status')[0],
    bar = document.getElementsByClassName('progress__bar')[0];

percentage.textContent = bar.style.width = '30%';

function setProgress(value) {
	if (value <= 100 && percentage.textContent.substring(0, -1) < value) {
		percentage.textContent = bar.style.width = value + '%';
	}
}

window.setTimeout(function() {
	setProgress(50);
}, 5000);