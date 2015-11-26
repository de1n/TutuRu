var rating = document.querySelector('.rating');

rating.onclick = function(event) {
	switch(event.target.text) {
		case '2':
			this.className = 'rating rating--twostar';
			break;
		case '3':
			this.className = 'rating rating--threestar';
			break;
		case '4':
			this.className = 'rating rating--fourstar';
			break;
		case '5':
			this.className = 'rating rating--fivestar';
			break;
		default:
			this.className = 'rating rating--onestar';
			break;
	}
}