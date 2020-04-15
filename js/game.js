---
---
var auth_user;
var database = new Firebase();
var pdf_loader = new PDFLoader(container='pdf-pages')

var storageRef;
var filename = Util.getParam('file');
var zoom_factor = 1.05;
var idleTime = 0;

database.authenticate().then(_auth_user => {
	auth_user = _auth_user;

	storageRef = firebase.storage().ref();
	storageRef.child(auth_user.uid + '/' + filename).getDownloadURL().then(function(url) {
		pdf_loader.load(url);
	});
});

function onResize() {
	let portrait = window.innerHeight > window.innerWidth;

	if (SCREEN_PORTRAIT ^ portrait) {
		$('.pdf-page').each((index, element) => {
			let ratio = parseFloat($(element).attr('ratio'));

			if (portrait) {
				$(element).css('height', window.innerWidth * ratio + 'px');
				$(element).css('width', window.innerWidth + 'px');
			}
			else {
				$(element).css('height', window.innerHeight + 'px');
				$(element).css('width', window.innerHeight / ratio + 'px');
			}
		});
	}

	SCREEN_PORTRAIT = portrait;
}

$('#zoom-in-btn').on('click', () => {
	$('.pdf-page').each((index, element) => {
		let factor = zoom_factor;
		$(element).css('height', $(element).height() * factor + 'px');
		$(element).css('width', $(element).width() * factor + 'px');
	});
});

$('#zoom-out-btn').on('click', () => {
	$('.pdf-page').each((index, element) => {
		let factor = 1 / zoom_factor;
		$(element).css('height', $(element).height() * factor + 'px');
		$(element).css('width', $(element).width() * factor + 'px');
	});
});

$(document).ready(function () {
	var idleInterval = setInterval(() => {
		if (idleTime > 1) fadeUtility(false);
		else idleTime = idleTime + 1;
	}, 500);

	$(this).mousemove(function (e) {
		idleTime = 0;
		fadeUtility(true);
	});

	$(this).scroll(function (e) {
		idleTime = 0;
		fadeUtility(true);
	});
});

function fadeUtility(fadeIn) {
	if (fadeIn) {
		$('#utility-section').removeClass('fade-out');
		$('#utility-section').addClass('fade-in');
	}
	else {
		$('#utility-section').removeClass('fade-in');
		$('#utility-section').addClass('fade-out');
	}
}
