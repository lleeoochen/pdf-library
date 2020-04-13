var auth_user;
var database = new Firebase();
var storageRef;

database.authenticate().then(_auth_user => {
	auth_user = _auth_user;
	storageRef = firebase.storage().ref();

	init();

	updateFileList();
});

function init() {
	storageRef = firebase.storage().ref();

	$('#upload-form').on("submit", async e => {
		e.preventDefault();

		let file = $('#upload-file').prop('files')[0];
		await storageRef.child(auth_user.uid + '/' + file.name).put(file);

		updateFileList();
	});
}


function updateFileList() {
	$('#file-list').html('');

	storageRef.child(auth_user.uid).listAll().then(function(res) {
		res.items.forEach(function(itemRef) {
			let match_html = $(`
                <h3> ${ itemRef.name } </h3>`
            );

            $('#file-list').append(match_html);
		});
	});
}