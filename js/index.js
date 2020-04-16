---
---
var auth_user;
var database = new Firebase();
var storageRef;
var path = [];

database.authenticate().then(_auth_user => {
	auth_user = _auth_user;

	path.push(auth_user.uid);

	init();

	updateFileList();
});

function init() {
	storageRef = firebase.storage().ref();

	$('#upload-form').on("submit", async e => {
		e.preventDefault();

		let files = $('#upload-file').prop('files');
		let db_promises = [];

		for (let i = 0; i < files.length; i++) {
		    let file = files[i];
			db_promises.push(storageRef.child(path.join('/') + '/' + file.name).put(file));
		}

		await Promise.all(db_promises);

		updateFileList();

		$('#upload-file').val('');
		$('#upload-label-text').text('Select File...');
	});

	$("#upload-form").on('change', function() {
		let file = $('#upload-file').prop('files')[0];
		$('#upload-label-text').text(file.name);
	});

	$("#new-folder-form").on('submit', async e => {
		e.preventDefault();

		let folder_name = $('#new-folder-text').val();
		await storageRef.child(path.join('/') + '/' + folder_name + '/x').put(new Uint8Array([0x00]));

		updateFileList();

		$('#new-folder-text').val('');
	});
}

function updateFileList() {
	$('#file-list').html('');

	if (path.length > 1) {
		$('#file-list').append($(`
			<div class="btn folder-link back-link"
			     ondrop="drop(event, '..')"
			     ondragover="allowDrop(event)"
			     onclick="enterFolder('..')">
				<img src="{{ site.baseUrl }}/assets/back.png" />
			</div>`
		));
	}

	storageRef.child(path.join('/')).listAll().then(function(res) {
		res.prefixes.forEach(function(folderRef) {
			$('#file-list').append($(`
				<div class="btn folder-link"
				     ondrop="drop(event, '${ Util.escape(folderRef.name) }')"
				     ondragover="allowDrop(event)"
				     onclick="enterFolder('${ Util.escape(folderRef.name) }')">
					${ folderRef.name }
				</div>`
			));
		});

		res.items.forEach(function(itemRef) {
			if (itemRef.name == 'x') return;

			$('#file-list').append($(`
				<a class="btn file-link"
				   href="{{ site.baseUrl }}/game?file=${ path.join('/') + '/' + itemRef.name }"
				   target="_blank"
				   draggable="true"
				   ondragstart="drag(event, '${ Util.escape(itemRef.name) }')">
					${ itemRef.name.replace(".pdf", "") }
				</a>`
			));
		});
	});
}

function enterFolder(folder) {
	if (folder == '..')
		path.pop(folder);
	else
		path.push(folder);
	updateFileList();
}

function allowDrop(e) {
	e.preventDefault();
}

function drag(e, file) {
	e.dataTransfer.setData("file", file);
}

function drop(e, folder) {
	e.preventDefault();
	let filename = e.dataTransfer.getData("file");

	let old_file_path = path.join('/') + '/' + filename;

	let new_file_path;
	if (folder == '..')
		new_file_path = path.slice(0, path.length - 1).join('/') + '/' + filename;
	else
		new_file_path = path.join('/') + '/' + folder + '/' + filename;

	move(old_file_path, new_file_path);
}

function move(old_file_path, new_file_path) {
	storageRef.child(old_file_path).getDownloadURL().then(url => {
		Util.request(url).then(async data => {
			await storageRef.child(new_file_path).put(data);
			await storageRef.child(old_file_path).delete();
			updateFileList();
		});
	});
}
