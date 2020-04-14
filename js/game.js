var auth_user;
var database = new Firebase();
var pdf_loader = new PDFLoader(canvasId='the-canvas',
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

	}).catch(function(error) {
	  // Handle any errors
	});
});
