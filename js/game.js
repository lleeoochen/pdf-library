---
---
var auth_user;
var database = new Firebase();
var storage = new FirebaseStorage();
var pdf_loader = new PDFLoader(container='pdf-pages')

var filename = Util.getParam('file');
var zoom_factor = 1.05;
var idle_time = 0;
var loaded = false;
var full_screen = false;

$('head title', window.parent.document).text(filename.split('/').pop().replace('.pdf', ''));

database.authenticate().then(_auth_user => {
	auth_user = _auth_user;

	storage.getDownloadURL(filename).then(async url => {
		await pdf_loader.load(url);
		loaded = true;
	});
});

function onResize() {
	let portrait = window.innerHeight > window.innerWidth;

	if ((SCREEN_PORTRAIT && !portrait) || (!SCREEN_PORTRAIT && portrait)) {
		SCREEN_PORTRAIT = portrait;

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

$('#full-screen-btn').on('click', () => {
	if (full_screen)
		closeFullscreen().then(() => resizeToFit());
	else
		openFullscreen().then(() => resizeToFit());
	full_screen = !full_screen;
});

function resizeToFit() {
	$('.pdf-page').each((index, element) => {
		let ratio = parseFloat($(element).attr('ratio'));

		if (SCREEN_PORTRAIT) {
			$(element).css('height', window.innerWidth * ratio + 'px');
			$(element).css('width', window.innerWidth + 'px');
		}
		else {
			$(element).css('height', window.innerHeight + 'px');
			$(element).css('width', window.innerHeight / ratio + 'px');
		}
	});
}

$(document).ready(function () {
	setInterval(() => {
		if (loaded) {
			if (idle_time > 1)
				fadeUtility(false);
			else
				idle_time = idle_time + 1;	
		}
	}, 500);

	$(this).on('mousemove scroll click', function (e) {
		idle_time = 0;
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

function openFullscreen() {
	let elem = document.documentElement;
	if (elem.requestFullscreen)
		return elem.requestFullscreen();

	else if (elem.mozRequestFullScreen) /* Firefox */
		return elem.mozRequestFullScreen();

	else if (elem.webkitRequestFullscreen) /* Chrome, Safari and Opera */
		return elem.webkitRequestFullscreen();

	else if (elem.msRequestFullscreen) /* IE/Edge */
		return elem.msRequestFullscreen();
	return Promise.resolve();
}

function closeFullscreen() {
	let elem = document.documentElement;
	if (document.exitFullscreen)
		return document.exitFullscreen();

	else if (document.mozCancelFullScreen) /* Firefox */
		return document.mozCancelFullScreen();

	else if (document.webkitExitFullscreen) /* Chrome, Safari and Opera */
		return document.webkitExitFullscreen();

	else if (document.msExitFullscreen) /* IE/Edge */
		return document.msExitFullscreen();
	return Promise.resolve();
}