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

		$('#upload-file').val('');
		$('#upload-label-text').text('Select File...');
	});

	$("#upload-form").on('change', function() {
		let file = $('#upload-file').prop('files')[0];
		$('#upload-label-text').text(file.name);
	});
}

function updateFileList() {
	$('#file-list').html('');

	storageRef.child(auth_user.uid).listAll().then(function(res) {
		res.items.forEach(function(itemRef) {
			let match_html = $(`
				<a class="btn file-link" href="/game?file=${ itemRef.name }">
					${ itemRef.name.replace(".pdf", "") }
				</a>`
			);

			$('#file-list').append(match_html);
		});
	});
}
