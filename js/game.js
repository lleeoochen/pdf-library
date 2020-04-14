---
---
var auth_user;
var database = new Firebase();
var pdf_loader = new PDFLoader(canvasBoxId='pdf-pages',
							   prevId='#prev',
							   nextId='#next',
							   countId='#page_num',
							   totalId='#page_count');

var storageRef;
var filename = Util.getParam('file');

database.authenticate().then(_auth_user => {
	auth_user = _auth_user;

	storageRef = firebase.storage().ref();

	storageRef.child(auth_user.uid + '/' + filename).getDownloadURL().then(function(url) {
		pdf_loader.load(url);
	});
});

function onResize() {
	$('.pdf-page').each((index, element) => {
		let ratio = parseFloat($(element).attr('ratio'));

		if (window.innerHeight > window.innerWidth) {
			$(element).css('height', window.innerWidth * ratio + 'px');
			$(element).css('width', window.innerWidth + 'px');
		}
		else {
			$(element).css('height', window.innerHeight + 'px');
			$(element).css('width', window.innerHeight / ratio + 'px');
		}
	});
	SCREEN_PORTRAIT = window.innerHeight > window.innerWidth;
}